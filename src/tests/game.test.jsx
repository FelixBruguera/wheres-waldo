import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import Game from "../components/Game"
import { MemoryRouter, Route, Routes } from "react-router"
import userEvent from "@testing-library/user-event"

const renderWithRouter = (ui, route, path) => {
  return render(
  <MemoryRouter initialEntries={[route]}> 
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  </MemoryRouter>
  )
}

let mockGameData
let mockPostResponse
let mockPatchResponse = (name) => { return { ok: true, json: () => Promise.resolve({ playerName: name }) } }

global.fetch = vi.fn((url, options) => {
    if (url.includes('/api/games')) {
      if ((!options || !options.method || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGameData),
        })
      }
    
      if (options.method === 'POST') {
          return Promise.resolve(mockPostResponse)
      }
    
      if (options.method === 'PATCH') {
        const { name } = JSON.parse(options.body)
        return Promise.resolve(mockPatchResponse(name))
      }
    }
  
    return Promise.reject(new Error(`Unhandled fetch request to ${url} with ${options}`))
  })

beforeEach(() => {
    vi.clearAllMocks()
})


describe("Game component", () => {
  it("renders correctly with a new game", async () => {
    const user = userEvent.setup()
    mockGameData = {
        gameData: {
          startTime: Date.now(),
          score: null,
          playerName: null,
        },
        characters: [],
    }

    renderWithRouter(<Game />, "/123", "/:id")
    expect(await screen.findByRole("heading")).toHaveTextContent("Where's Waldo?")
    expect(await screen.findByLabelText("Time Elapsed")).toHaveTextContent("00:00:00")
    expect(await screen.findByLabelText("Characters found")).toHaveTextContent("0 / 4")
    await user.click(screen.getByText("Instructions"))
    expect(await screen.queryByText("Found")).toBeNull()
  })

  it("renders correctly with previous game data", async () => {
    const user = userEvent.setup()
    const currentDate = new Date()
    mockGameData = {
        gameData: {
            startTime: new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - 1, currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()),
            score: null,
            playerName: null,
          },
          characters: [{id: 1, name: "Waldo"}, {id: 2, name: "Wenda"}],
    }

    renderWithRouter(<Game />, "/123", "/:id")
    expect(await screen.findByLabelText("Time Elapsed")).toHaveTextContent("24:00:00")
    expect(await screen.findByLabelText("Characters found")).toHaveTextContent("2 / 4")
    await user.click(screen.getByText("Instructions"))
    expect(screen.getAllByText("Found")).toHaveLength(2)
  })

  it("shows a notification and a marker after a bad guess", async () => {
    const user = userEvent.setup()
    mockGameData = {
        gameData: {
          startTime: Date.now(),
          score: null,
          playerName: null,
        },
        characters: [],
    }
    mockPostResponse = {
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: 'No character there' }),
    }
    renderWithRouter(<Game />, "/123", "/:id")
    await user.click(await screen.findByRole("img"))
    expect(await screen.findByText("No character there")).toBeVisible()
    expect(await screen.getByTestId("marker")).toBeVisible()
  })
  it("shows a notification and a marker with the correct styling after a good guess", async () => {
      const user = userEvent.setup()
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: null,
            playerName: null,
          },
          characters: [],
      }
      mockPostResponse = {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: "playing", found: { name: "Waldo", id: 1} }),
      }
      renderWithRouter(<Game />, "/123", "/:id")
      await user.click(await screen.findByRole("img"))
      expect(await screen.findByText("You've found Waldo!")).toBeVisible()
      expect(await screen.getByTestId("marker")).toBeVisible()
      expect(await screen.getByTestId("marker")).toHaveClass("border-white")
    })
  it("shows the correct error message after guessing an already found character", async () => {
      const user = userEvent.setup()
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: null,
            playerName: null,
          },
          characters: [],
      }
      mockPostResponse = {
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: "playing", found: { name: "Waldo", id: 1} }),
      }
      renderWithRouter(<Game />, "/123", "/:id")
      await user.click(await screen.findByRole("img"))
      expect(await screen.findByText("You've found Waldo!")).toBeVisible()
      expect(await screen.getByTestId("marker")).toBeVisible()
      expect(await screen.getByTestId("marker")).toHaveClass("border-white")
      mockPostResponse = {
          ok: false,
          status: 400,
          json: () => Promise.resolve({"error":"You've already found that character"}),
      }
      await user.click(await screen.findByRole("img"))
      expect(await screen.getByText("You've already found that character")).toBeVisible()
      expect(await screen.findByLabelText("Characters found")).toHaveTextContent("1 / 4")
    })
  it("renders the GameOver component when the response status is finished", async () => {
    const user = userEvent.setup()
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: null,
            playerName: null,
          },
          characters: [{id: 1}, {id: 2}, {id: 3}],
      }
      mockPostResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: "finished", score: 60 }),
      }
      renderWithRouter(<Game />, "/123", "/:id")
      expect(await screen.findByLabelText("Characters found")).toHaveTextContent("3 / 4")
      await user.click(await screen.findByRole("img"))
      expect(await screen.findByText("You've found them all!")).toBeVisible()
      expect(await screen.getByRole("textbox")).toBeVisible()
      expect(await screen.getByText("00:01:00")).toBeVisible()
    })
  it("renders the GameOver component with the form when the game has a score but no name", async () => {
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: 60,
            playerName: null,
          },
          characters: [],
      }
      renderWithRouter(<Game />, "/123", "/:id")
      expect(await screen.findByText("You've found them all!")).toBeVisible()
      expect(await screen.getByRole("textbox")).toBeVisible()
      expect(await screen.getByText("00:01:00")).toBeVisible()
    })
    it("renders the GameOver component without the form when the game has a score and a name", async () => {
        mockGameData = {
            gameData: {
              startTime: Date.now(),
              score: 60,
              playerName: "Test",
            },
            characters: [],
        }
        renderWithRouter(<Game />, "/123", "/:id")
        expect(await screen.findByText("You've found them all!")).toBeVisible()
        expect(await screen.queryByRole("textbox")).toBeNull()
        expect(await screen.getByText("00:01:00")).toBeVisible()
        expect(await screen.getByText("Test")).toBeVisible()
      })
    it("updates the name after submiting the GameOver form", async () => {
        const user = userEvent.setup()
        mockGameData = {
            gameData: {
              startTime: Date.now(),
              score: 100,
              playerName: null,
            },
            characters: [],
        }
        renderWithRouter(<Game />, "/123", "/:id")
        expect(await screen.findByText("You've found them all!")).toBeVisible()
        await user.type(screen.getByPlaceholderText("Claim your time"), "Testing")
        expect(await screen.getByPlaceholderText("Claim your time")).toHaveValue("Testing")
        await user.click(await screen.findByText("Save"))
        expect(await screen.findByText("Testing")).toBeVisible()
        expect(await screen.queryByPlaceholderText("Claim your time")).toBeNull()
        expect(await screen.queryByRole("button", { name: "Save" })).toBeNull()
      })
    it("shows the correct error message when the patch request fails", async () => {
        const user = userEvent.setup()
        mockGameData = {
            gameData: {
              startTime: Date.now(),
              score: 100,
              playerName: null,
            },
            characters: [],
        }
        mockPatchResponse = (name) => { return { ok: false, json: () => Promise.resolve({ error: "Name must have more than 3 and less than 20 characters" }) } }
        renderWithRouter(<Game />, "/123", "/:id")
        expect(await screen.findByText("You've found them all!")).toBeVisible()
        await user.type(screen.getByPlaceholderText("Claim your time"), "Testing")
        expect(await screen.getByPlaceholderText("Claim your time")).toHaveValue("Testing")
        await user.click(await screen.findByText("Save"))
        expect(await screen.findByText("Name must have more than 3 and less than 20 characters")).toBeVisible()
        expect(await screen.queryByPlaceholderText("Claim your time")).not.toBeNull()
        expect(await screen.queryByRole("button", { name: "Save" })).not.toBeNull()
      })
})

