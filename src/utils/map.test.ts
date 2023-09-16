import createMap from "./map.ts";

describe('Generate Map', () => {
    test('Map should exist', () => {
        expect(createMap(5, 5)).toBeTruthy()
    })

    test('Map column is equal', () => {
        const map = createMap(2, 5)
        expect(map.col).toEqual(2)
    })

    test('Map row is equal', () => {
        const map = createMap(2, 5)
        expect(map.row).toEqual(5)
    })

    test('Map col and row is equal to random', () => {
        const randomCol = Math.floor(Math.random() * 10) + 1
        const randomRow = Math.floor(Math.random() * 10) + 1
        const map = createMap(randomCol, randomRow)
        expect(map.col).toEqual(randomCol)
        expect(map.row).toEqual(randomRow)
    })
})

describe('Generate Apple', () => {
    test('apple should be exist', () => {
        const map = createMap(2, 2)
        expect(map.apple).toBeTruthy()
    })

    test('apple has position', () => {
        const map = createMap(5, 5)
        expect(map.apple.position.y).toBeGreaterThanOrEqual(0)
        expect(map.apple.position.x).toBeGreaterThanOrEqual(0)
    })

    test('apple is generated inside the map', () => {
        const map = createMap(5, 5)
        expect(map.apple.position.y).toBeLessThanOrEqual(5)
        expect(map.apple.position.x).toBeLessThanOrEqual(5)
    })
})

describe('Generate Snake', () => {
    test('snake should be exist', () => {
        const map = createMap(5, 5)
        expect(map.snake).toBeTruthy()
    })

    test('snake has position', () => {
        const map = createMap(5, 5)
        expect(map.snake.positions.length).toBeGreaterThan(0)
    })

    test('snake has a position', () => {
        const map = createMap(5, 5)
        expect(map.snake.positions.length).toEqual(1)
    })

    test('snake has different position as apples', () => {
        const map = createMap(5, 5)
        expect(map.snake.positions[0].x).not.toEqual(map.apple.position.x)
        expect(map.snake.positions[0].y).not.toEqual(map.apple.position.y)
    })

    test('snake is inside the map', () => {
        const map = createMap(5, 5)
        expect(map.snake.positions[0].y).toBeLessThanOrEqual(5)
        expect(map.snake.positions[0].y).toBeGreaterThanOrEqual(0)
        expect(map.snake.positions[0].x).toBeLessThanOrEqual(5)
        expect(map.snake.positions[0].x).toBeGreaterThanOrEqual(0)
    })
})



