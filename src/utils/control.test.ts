import createSnakeMap from "./map.ts";
import {changeSnakeHeadDirection, nextSnakeMove} from "./control.ts";
import {SnakeHeadDirection} from "../@types/snake.type.ts";

describe("Snake direction", () => {
    test('should have different position after moving', () => {
        const map = createSnakeMap(5, 5)
        map.snake.positions[0] = {x: 0, y: 0}
        const beforeMovePosition = {...map.snake.positions[0]};
        map.snake.headDirection = SnakeHeadDirection.RIGHT;

        nextSnakeMove(map)

        const afterMovePosition = map.snake.positions[0];
        const isXChanged = beforeMovePosition.x !== afterMovePosition.x;
        const isYChanged = beforeMovePosition.y !== afterMovePosition.y;
        expect(isXChanged || isYChanged).toBe(true);
    })

    test('should go to correct direction', () => {
        const variants = [
            {direction: SnakeHeadDirection.RIGHT, exception: {x: 4, y: 3}},
            {direction: SnakeHeadDirection.LEFT, exception: {x: 2, y: 3}},
            {direction: SnakeHeadDirection.UP, exception: {x: 3, y: 2}},
            {direction: SnakeHeadDirection.DOWN, exception: {x: 3, y: 4}}
        ]

        for (const {direction, exception} of variants) {
            const map = createSnakeMap(4, 4)
            map.snake.positions[0] = {x: 3, y: 3}
            map.snake.headDirection = direction;

            nextSnakeMove(map)

            const afterMovePosition = map.snake.positions[0];
            expect(afterMovePosition.x).toBe(exception.x);
            expect(afterMovePosition.y).toBe(exception.y);
        }
    })

    test('cannot change the snake direction to where it come from', () => {
        const variants = [
            {
                headDirection: SnakeHeadDirection.RIGHT,
                positions: [{x: 1, y: 0}, {x: 0, y: 0}],
                changeDirectionTo: SnakeHeadDirection.LEFT
            }, {
                headDirection: SnakeHeadDirection.LEFT,
                positions: [{x: 1, y: 1}, {x: 2, y: 1}],
                changeDirectionTo: SnakeHeadDirection.RIGHT
            }, {
                headDirection: SnakeHeadDirection.UP,
                positions: [{x: 0, y: 1}, {x: 0, y: 2}],
                changeDirectionTo: SnakeHeadDirection.DOWN
            }, {
                headDirection: SnakeHeadDirection.DOWN,
                positions: [{x: 1, y: 1}, {x: 1, y: 0}],
                changeDirectionTo: SnakeHeadDirection.UP
            }
        ]

        for (const {headDirection, changeDirectionTo, positions} of variants) {
            const map = createSnakeMap(4, 4)
            map.snake.headDirection = headDirection
            map.snake.positions = positions

            changeSnakeHeadDirection(map, changeDirectionTo)
            nextSnakeMove(map)

            expect(map.snake.headDirection).toBe(headDirection)
        }
    })

    test('cannot change the snake direction where it come from (handled double direction changing per move)', () => {
        const map = createSnakeMap(4, 4)
        map.snake.headDirection = SnakeHeadDirection.RIGHT
        map.snake.positions = [{x: 1, y: 0}, {x: 0, y: 0}]

        changeSnakeHeadDirection(map, SnakeHeadDirection.UP)
        changeSnakeHeadDirection(map, SnakeHeadDirection.LEFT) // cannot change to this because the snake came from left
        nextSnakeMove(map)

        expect(map.snake.headDirection).toBe(SnakeHeadDirection.UP)
    })
})

describe("Snake eats apple", () => {
    test('should the snake grow when eats an apple', () => {
        const variants = [
            {direction: SnakeHeadDirection.RIGHT, applePosition: {x: 4, y: 3}},
            {direction: SnakeHeadDirection.LEFT, applePosition: {x: 2, y: 3}},
            {direction: SnakeHeadDirection.UP, applePosition: {x: 3, y: 2}},
            {direction: SnakeHeadDirection.DOWN, applePosition: {x: 3, y: 4}}
        ]

        for (const {direction, applePosition} of variants) {
            const map = createSnakeMap(4, 4)
            map.apple.position = applePosition
            map.snake.positions[0] = {x: 3, y: 3}
            map.snake.headDirection = direction

            nextSnakeMove(map)

            expect(map.snake.positions.length).toBe(2);
        }
    })

    test('should apple appear in different position when the snake eats the apple', () => {
        const map = createSnakeMap(2, 3)
        map.snake.positions[0] = {x: 2, y: 2}
        const beforeMoveApplePosition = {x: 3, y: 2}
        map.apple.position = beforeMoveApplePosition
        map.snake.headDirection = SnakeHeadDirection.RIGHT

        nextSnakeMove(map)

        const afterMoveApplePosition = map.apple.position;
        const isAppleXChanged = afterMoveApplePosition.x !== beforeMoveApplePosition.x;
        const isAppleYChanged = afterMoveApplePosition.y !== beforeMoveApplePosition.y;
        expect(isAppleXChanged || isAppleYChanged).toBe(true);
    })

    test('should apple not appear where the snake is', () => {
        const variants = [
            {
                /**
                 *     [s1,sh]
                 *     [-,a]
                 */
                applePosition: {x: 1, y: 1},
                newApplePosition: {x: 0, y: 1},
                snakeHeadDirection: SnakeHeadDirection.DOWN,
                snakePositions: [{x: 1, y: 0}, {x: 0, y: 0}]
            },
            {
                /**
                 *     [-,a]
                 *     [s1,sh]
                 */
                applePosition: {x: 1, y: 0},
                newApplePosition: {x: 0, y: 0},
                snakeHeadDirection: SnakeHeadDirection.UP,
                snakePositions: [{x: 1, y: 1}, {x: 0, y: 1}]
            },
            {
                /**
                 *     [a,-]
                 *     [sh,s1]
                 */
                applePosition: {x: 0, y: 0},
                newApplePosition: {x: 1, y: 0},
                snakeHeadDirection: SnakeHeadDirection.UP,
                snakePositions: [{x: 0, y: 1}, {x: 1, y: 1}]
            },
            {
                /**
                 *     [-,s1]
                 *     [a,sh]
                 */
                applePosition: {x: 0, y: 1},
                newApplePosition: {x: 0, y: 0},
                snakeHeadDirection: SnakeHeadDirection.LEFT,
                snakePositions: [{x: 1, y: 1}, {x: 1, y: 0}]
            },
        ]

        for (const variant of variants) {
            const map = createSnakeMap(1, 1)
            map.snake.positions = variant.snakePositions
            map.apple.position = variant.applePosition
            map.snake.headDirection = variant.snakeHeadDirection

            nextSnakeMove(map)

            expect(map.apple.position.x).toBe(variant.newApplePosition.x);
            expect(map.apple.position.y).toBe(variant.newApplePosition.y);
        }
    })
})

describe('Game over', () => {
    test('should finish the game if the snake hit the wall', () => {
        const variants = [
            {snakePositions: [{x: 0, y: 0}], headDirection: SnakeHeadDirection.UP},
            {snakePositions: [{x: 0, y: 0}], headDirection: SnakeHeadDirection.LEFT},
            {snakePositions: [{x: 1, y: 0}], headDirection: SnakeHeadDirection.UP},
            {snakePositions: [{x: 1, y: 0}], headDirection: SnakeHeadDirection.RIGHT},
            {snakePositions: [{x: 1, y: 1}], headDirection: SnakeHeadDirection.RIGHT},
            {snakePositions: [{x: 1, y: 1}], headDirection: SnakeHeadDirection.DOWN},
            {snakePositions: [{x: 0, y: 1}], headDirection: SnakeHeadDirection.LEFT},
            {snakePositions: [{x: 0, y: 1}], headDirection: SnakeHeadDirection.DOWN},
        ]
        for (const variant of variants) {
            const map = createSnakeMap(1, 1)
            map.snake.positions = variant.snakePositions;
            map.snake.headDirection = variant.headDirection;

            nextSnakeMove(map)

            expect(map.isGameOver).toBe(true);
        }
    })

    test('should finish the game if the snake hit itself', () => {
        /**
         * [s4,s5, s6]
         * [s3,sh, s7]
         * [s2,s1, a]
         */
        const snakePositionsV1 = [
            {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1},
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1},
        ]

        /**
         * [s4,s3, s2]
         * [s5,sh,s1]
         * [s6,s7, a]
         */
        const snakePositionsV2 = [
            {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}, {x: 1, y: 0},
            {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2},
        ]

        const variants = [
            {snakePositions: snakePositionsV1, headDirection: SnakeHeadDirection.UP},
            {snakePositions: snakePositionsV1, headDirection: SnakeHeadDirection.LEFT},
            {snakePositions: snakePositionsV1, headDirection: SnakeHeadDirection.RIGHT},

            {snakePositions: snakePositionsV2, headDirection: SnakeHeadDirection.DOWN},
            {snakePositions: snakePositionsV2, headDirection: SnakeHeadDirection.LEFT},
            {snakePositions: snakePositionsV2, headDirection: SnakeHeadDirection.UP},
        ]

        for (const variant of variants) {
            const map = createSnakeMap(2, 2)
            map.snake.positions = variant.snakePositions;
            map.apple.position = {x: 2, y: 2};
            map.snake.headDirection = variant.headDirection;

            nextSnakeMove(map)

            expect(map.isGameOver).toBe(true);
        }
    })

    test('cant move if the game is over', () => {
        const map = createSnakeMap(1, 1)
        map.isGameOver = true
        expect(() => {
            nextSnakeMove(map)
        }).toThrow('The game is over')
    })
})

describe('Snake move', () => {
    test('the snake length not changes if not eating the apple', () => {
        const map = createSnakeMap(3, 3)
        map.snake.positions = [{x: 0, y: 0}]
        map.apple.position = {x: 2, y: 2}
        map.snake.headDirection = SnakeHeadDirection.RIGHT

        nextSnakeMove(map)

        expect(map.snake.positions.length).toBe(1);
    })

    test('a longer snake length not changes after a move if not eating the apple', () => {
        const variants = [
            {headDirection: SnakeHeadDirection.RIGHT, snakePositions: [{x: 1, y: 0}, {x: 0, y: 0}]},
            {headDirection: SnakeHeadDirection.LEFT, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.UP, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.DOWN, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
        ]

        for (const variant of variants) {
            const map = createSnakeMap(3, 3)
            map.snake.positions = [...variant.snakePositions];
            map.apple.position = {x: -1, y: -1}
            map.snake.headDirection = variant.headDirection;

            nextSnakeMove(map)

            expect(map.snake.positions.length).toBe(variant.snakePositions.length);
        }
    })

    test('the snake cant break away after a move', () => {
        const variants = [
            {headDirection: SnakeHeadDirection.RIGHT, snakePositions: [{x: 1, y: 0}, {x: 0, y: 0}]},
            {headDirection: SnakeHeadDirection.LEFT, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.UP, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.DOWN, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
        ]

        const map = createSnakeMap(3, 3)
        map.snake.positions = [{x: 1, y: 0}, {x: 0, y: 0}]
        map.apple.position = {x: 2, y: 2}
        map.snake.headDirection = SnakeHeadDirection.LEFT

        for (const variant of variants) {
            const map = createSnakeMap(3, 3)
            map.snake.positions = variant.snakePositions;
            map.apple.position = {x: -1, y: -1}
            map.snake.headDirection = variant.headDirection;

            nextSnakeMove(map)

            for (let i = 0; i < map.snake.positions.length - 1; i++) {
                expect(Math.abs(map.snake.positions[i].x - map.snake.positions[i + 1].x))
                    .toBeLessThanOrEqual(1);
                expect(Math.abs(map.snake.positions[i].y - map.snake.positions[i + 1].y))
                    .toBeLessThanOrEqual(1);
            }
        }
    })

})