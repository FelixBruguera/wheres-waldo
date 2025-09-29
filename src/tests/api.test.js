import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../api/index'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

vi.mock('drizzle-orm/d1')

describe('API Endpoint: POST /api/games/:id', () => {
  const mockQueryBuilder = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn(),
    leftJoin: vi.fn().mockReturnThis(),
  }

  const mockUpdate = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis()
  }

  const mockDb = {
    select: vi.fn(() => mockQueryBuilder),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    batch: vi.fn(),
    update: vi.fn(() => mockUpdate)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    drizzle.mockReturnValue(mockDb)
  })

  it('should return "playing" status and the found character when coordinates are correct', async () => {
    const gameId = 'test-game-123'
    const characterToFind = {
      id: 1,
      name: 'Waldo',
      xMin: 0.1,
      xMax: 0.2,
      yMin: 0.5,
      yMax: 0.6,
    }
    const requestBody = { x: 0.05, y: 0.55 }
    mockQueryBuilder.where
      .mockResolvedValueOnce([characterToFind])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ startTime: new Date().toISOString() }])

    mockDb.returning.mockResolvedValueOnce([{
      characterId: characterToFind.id,
      gameId: gameId,
    }])
    const request = new Request(`http://localhost/api/games/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    const response = await app.fetch(request, { DB: {} })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody.status).toBe('playing')
    expect(responseBody.found.name).toBe(characterToFind.name)
    expect(responseBody.found.characterId).toBe(characterToFind.id)
    expect(mockDb.select).toHaveBeenCalledTimes(3)
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(3)
    expect(mockDb.insert).toHaveBeenCalledWith(schema.foundCharacters)
    expect(mockDb.values).toHaveBeenCalledWith({
      characterId: characterToFind.id,
      gameId: gameId,
    })
    expect(mockDb.returning).toHaveBeenCalledTimes(1)
  })
  it("should return 'finished' and the score when there are 3 characters found", async () => {
    const gameId = 'test-game-123'
    const characterToFind = {
      id: 1,
      name: 'Waldo',
      xMin: 0.1,
      xMax: 0.2,
      yMin: 0.5,
      yMax: 0.6,
    }
    const requestBody = { x: 0.05, y: 0.55 }
    mockQueryBuilder.where
      .mockResolvedValueOnce([characterToFind])
      .mockResolvedValueOnce([{id: 2}, {id: 3}, {id: 4}])
      .mockResolvedValueOnce([{ startTime: new Date().toISOString() }])

    mockDb.batch.mockResolvedValueOnce([{
      characterId: characterToFind.id,
      gameId: gameId,
    }, [{ score: 100}]])
    const request = new Request(`http://localhost/api/games/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    const response = await app.fetch(request, { DB: {} })
    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(responseBody.status).toBe('finished')
    expect(responseBody.score).toBe(100)
    expect(mockDb.select).toHaveBeenCalledTimes(3)
    expect(mockDb.insert).toHaveBeenCalledTimes(1)
    expect(mockDb.insert).toHaveBeenCalledWith(schema.foundCharacters)
    expect(mockDb.values).toHaveBeenCalledWith({
      characterId: characterToFind.id,
      gameId: gameId,
    })
    expect(mockDb.update).toHaveBeenCalledTimes(1)
  })
    it("returns the correct error message when the character has already been found", async () => {
    const gameId = 'test-game-123'
    const characterToFind = {
      id: 1,
      name: 'Waldo',
      xMin: 0.1,
      xMax: 0.2,
      yMin: 0.5,
      yMax: 0.6,
    }
    const requestBody = { x: 0.05, y: 0.55 }
    mockQueryBuilder.where
      .mockResolvedValueOnce([characterToFind])
      .mockResolvedValueOnce([{id: 1}])
      .mockResolvedValueOnce([{ startTime: new Date().toISOString() }])

    const request = new Request(`http://localhost/api/games/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    const response = await app.fetch(request, { DB: {} })
    const responseBody = await response.json()

    expect(response.status).toBe(400)
    expect(responseBody.error).toBe("You've already found that character")
    expect(mockDb.select).toHaveBeenCalledTimes(3)
    expect(mockDb.insert).not.toHaveBeenCalled()
    expect(mockDb.insert).not.toHaveBeenCalledWith(schema.foundCharacters)
    expect(mockDb.values).not.toHaveBeenCalledWith({
      characterId: characterToFind.id,
      gameId: gameId,
    })
    expect(mockDb.update).not.toHaveBeenCalled()
  })
it("returns the correct error message the coordinates are wrong", async () => {
    const gameId = 'test-game-123'
    const requestBody = { x: 0.05, y: 0.55 }
    mockQueryBuilder.where
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{id: 1}])
      .mockResolvedValueOnce([{ startTime: new Date().toISOString() }])

    const request = new Request(`http://localhost/api/games/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    const response = await app.fetch(request, { DB: {} })
    const responseBody = await response.json()

    expect(response.status).toBe(422)
    expect(responseBody.error).toBe("No character there")
    expect(mockDb.select).toHaveBeenCalledTimes(3)
    expect(mockDb.insert).not.toHaveBeenCalled()
    expect(mockDb.insert).not.toHaveBeenCalled()
    expect(mockDb.values).not.toHaveBeenCalled()
    expect(mockDb.update).not.toHaveBeenCalled()
  })
})
