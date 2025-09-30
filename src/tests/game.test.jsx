import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Game from "../components/Game";
import { MemoryRouter, Route, Routes } from "react-router";
import userEvent from "@testing-library/user-event";

const renderWithRouter = (ui, route, path) => {
  return render(
  <MemoryRouter initialEntries={[route]}> 
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  </MemoryRouter>
  )
}

let mockGameData;
let mockPostResponse;

global.fetch = vi.fn((url, options) => {
    if (url.includes('/api/games')) {
      // Initial GET request to load game data
      if ((!options || !options.method || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGameData),
        });
      }
    
      // POST request for checkSelection
      if (options.method === 'POST') {
          return Promise.resolve(mockPostResponse);
      }
    
      // PATCH request for updateName
      if (options.method === 'PATCH') {
        const { name } = JSON.parse(options.body)
        console.log(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ playerName: name }),
        });
      }
    }
  
    // Fallback for unhandled requests
    return Promise.reject(new Error(`Unhandled fetch request to ${url} with ${options}`));
  });

beforeEach(() => {
    vi.clearAllMocks();
})


describe("Game component", () => {
  it("renders correctly with a new game", async () => {
    const user = userEvent.setup();
    mockGameData = {
        gameData: {
          startTime: Date.now(),
          score: null,
          playerName: null,
        },
        characters: [],
    };

    renderWithRouter(<Game />, "/123", "/:id")
    expect(await screen.findByRole("heading")).toHaveTextContent("Where's Waldo?")
    expect(await screen.findByLabelText("Time Elapsed")).toHaveTextContent("00:00:00")
    expect(await screen.findByLabelText("Characters found")).toHaveTextContent("0 / 4")
    await user.click(screen.getByText("Instructions"))
    expect(await screen.queryByText("Found")).toBeNull()
  })

  it("renders correctly with previous game data", async () => {
    const user = userEvent.setup();
    const currentDate = new Date()
    mockGameData = {
        gameData: {
            startTime: new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() - 1, currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()),
            score: null,
            playerName: null,
          },
          characters: [{id: 1, name: "Waldo"}, {id: 2, name: "Wenda"}],
    };

    renderWithRouter(<Game />, "/123", "/:id")
    expect(await screen.findByLabelText("Time Elapsed")).toHaveTextContent("24:00:00")
    expect(await screen.findByLabelText("Characters found")).toHaveTextContent("2 / 4")
    await user.click(screen.getByText("Instructions"))
    expect(screen.getAllByText("Found")).toHaveLength(2)
  })

  it("shows a notification and a marker after a bad guess", async () => {
    const user = userEvent.setup();
    mockGameData = {
        gameData: {
          startTime: Date.now(),
          score: null,
          playerName: null,
        },
        characters: [],
    };
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
      const user = userEvent.setup();
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: null,
            playerName: null,
          },
          characters: [],
      };
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
  it("renders the GameOver component with the form when the game has a score but no name", async () => {
      const user = userEvent.setup();
      mockGameData = {
          gameData: {
            startTime: Date.now(),
            score: 60,
            playerName: null,
          },
          characters: [],
      };
      renderWithRouter(<Game />, "/123", "/:id")
      expect(await screen.findByText("You've found them all!")).toBeVisible()
      expect(await screen.getByRole("textbox")).toBeVisible()
      expect(await screen.getByText("00:01:00")).toBeVisible()
    })
    it("renders the GameOver component without the form when the game has a score and a name", async () => {
        const user = userEvent.setup();
        mockGameData = {
            gameData: {
              startTime: Date.now(),
              score: 60,
              playerName: "Test",
            },
            characters: [],
        };
        renderWithRouter(<Game />, "/123", "/:id")
        expect(await screen.findByText("You've found them all!")).toBeVisible()
        expect(await screen.queryByRole("textbox")).toBeNull()
        expect(await screen.getByText("00:01:00")).toBeVisible()
        expect(await screen.getByText("Test")).toBeVisible()
      })
    it("updates the name after submiting the GameOver form", async () => {
        const user = userEvent.setup();
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
        const input = await screen.getByRole("textbox")
        const submit = await screen.findByRole("button", {name: "Save"})
        await user.type(input, "Testing")
        await user.click(submit)
        expect(await screen.queryByText("Save")).toBeNull()
        expect(await screen.getByText("Testing")).toBeVisible()
      })
});

