import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../api/index'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'
import { asc } from 'drizzle-orm'

vi.mock('drizzle-orm/d1')

describe("The API", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        drizzle.mockReturnValue(mockDb)
    })
    const mockQueryBuilder = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        leftJoin: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis()
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
    describe("POST /api/games", () => {
        it("creates a game", async () => {
            const request = new Request(`http://localhost/api/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            mockDb.returning.mockReturnValueOnce([{id: "game-123"}])
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(200)
            expect(responseBody[0].id).toBe("game-123")
            expect(mockDb.insert).toHaveBeenCalledTimes(1)
            expect(mockDb.returning).toHaveBeenCalledTimes(1)
        })
    })

    describe("PATCH /api/games/:id", () => {
        it("doesn't allow names with less than 3 characters", async () => {
            const request = new Request(`http://localhost/api/games/game-123`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "me"})
            })
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(400)
            expect(responseBody.error).toBe("Name must have more than 3 and less than 20 characters")
            expect(mockDb.update).not.toHaveBeenCalled()
        })
        it("doesn't allow names with more than 20 characters", async () => {
            const request = new Request(`http://localhost/api/games/game-123`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "long name long name long name"})
            })
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(400)
            expect(responseBody.error).toBe("Name must have more than 3 and less than 20 characters")
            expect(mockDb.update).not.toHaveBeenCalled()
        })
        it("updates when the name is valid", async () => {
            const request = new Request(`http://localhost/api/games/game-123`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "my name"})
            })
            mockUpdate.returning.mockReturnValueOnce([{ playerName: "my name"}])
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(200)
            expect(responseBody.playerName).toBe("my name")
            expect(mockDb.update).toHaveBeenCalledTimes(1)
            expect(mockUpdate.set).toHaveBeenCalledWith({ playerName: "my name"})
        })
        it("returns 500 when the game alreadyh as a name or the id doesn't exist", async () => {
            const request = new Request(`http://localhost/api/games/game-123`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: "my name"})
            })
            mockUpdate.returning.mockReturnValueOnce([])
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.text()

            expect(response.status).toBe(500)
            expect(mockDb.update).toHaveBeenCalledTimes(1)
            expect(mockUpdate.set).toHaveBeenCalledWith({ playerName: "my name"})
        })
    })

    describe("GET /api/games/:id", () => {
        it("responds with the correct data", async () => {
            mockQueryBuilder.where
            .mockResolvedValueOnce([{startTime: "123", score: null, playerName: null}])
            .mockResolvedValueOnce([{id: 1}, {id: 2}])

            const request = new Request(`http://localhost/api/games/game-123`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            })
            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(200)
            expect(responseBody.gameData.startTime).toBe('123')
            expect(responseBody.gameData.score).toBe(null)
            expect(responseBody.gameData.playerName).toBe(null)
            expect(responseBody.characters).toStrictEqual([{id: 1}, {id: 2}])
            expect(mockDb.select).toHaveBeenCalledTimes(2)
            expect(mockQueryBuilder.where).toHaveBeenCalledTimes(2)
        })
        it("returns 404 when the id doesn't exists", async () => {
            mockQueryBuilder.where
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            const request = new Request(`http://localhost/api/games/game-123`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const response = await app.fetch(request, { DB: {} })
            expect(response.status).toBe(404)
        })
    })

    describe('POST /api/games/:id', () => {
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
    describe('GET /api/leaderboard', () => { 
        it("uses the right parameters", async () => {
            mockQueryBuilder.limit.mockResolvedValueOnce([{ name: "test", score: "200"}, { name: "test2", score: "300"}])
            const request = new Request(`http://localhost/api/leaderboard`, { method: 'GET' })

            const response = await app.fetch(request, { DB: {} })
            const responseBody = await response.json()

            expect(response.status).toBe(200)
            expect(responseBody).toStrictEqual([{ name: "test", score: "200"}, { name: "test2", score: "300"}])
            expect(mockDb.select).toHaveBeenCalledTimes(1)
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(asc(schema.games.scoreInSeconds))
            expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10)
        })
    })
})
