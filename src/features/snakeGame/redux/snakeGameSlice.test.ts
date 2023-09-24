import reducer, {changeSnakeDirection, initializeGame, moveSnake, SnakeGameState} from "./snakeGameSlice.ts";
import {SnakeHeadDirection} from "../../../@types/snake.type.ts";

describe('Generate Map', () => {
    test('Map column, row is equal', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 5}));
        expect(state.map.xMax).toBe(2)
        expect(state.map.yMax).toBe(5)
    })

    test('Map col and row is equal to random', () => {
        const randomY = Math.floor(Math.random() * 10) + 1
        const randomX = Math.floor(Math.random() * 10) + 1
        const state = reducer(undefined, initializeGame({xMax: randomX, yMax: randomY}));
        expect(state.map.xMax).toBe(randomX)
        expect(state.map.yMax).toBe(randomY)
    })
})

describe('Generate Apple', () => {
    test('apple has position', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        expect(state.apple.position.y).toBeGreaterThanOrEqual(0)
        expect(state.apple.position.x).toBeGreaterThanOrEqual(0)
    })

    test('apple is generated inside the map', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.apple.position.y).toBeLessThanOrEqual(5)
        expect(state.apple.position.y).toBeGreaterThanOrEqual(0)
        expect(state.apple.position.x).toBeLessThanOrEqual(5)
        expect(state.apple.position.x).toBeGreaterThan(0)
    })
})

describe('Generate Snake', () => {
    test('snake should be exist', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.snake).toBeTruthy()
    })

    test('snake has position', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.snake.positions.length).toBeGreaterThan(0)
    })

    test('snake starts in the middle', () => {
        const statePositive = reducer(undefined, initializeGame({xMax: 6, yMax: 8}));
        expect(statePositive.snake.positions[0].x).toEqual(3)
        expect(statePositive.snake.positions[0].y).toEqual(4)

        const stateNegative = reducer(undefined, initializeGame({xMax: 5, yMax: 7}));
        expect(stateNegative.snake.positions[0].x).toEqual(2)
        expect(stateNegative.snake.positions[0].y).toEqual(3)
    })

    test('snake has only one position after init', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.snake.positions.length).toEqual(1)
    })

    test('snake has different position as apples', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.snake.positions[0].x).not.toEqual(state.apple.position.x)
        expect(state.snake.positions[0].y).not.toEqual(state.apple.position.y)
    })

    test('snake is inside the map', () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        expect(state.snake.positions[0].y).toBeLessThanOrEqual(5)
        expect(state.snake.positions[0].y).toBeGreaterThanOrEqual(0)
        expect(state.snake.positions[0].x).toBeLessThanOrEqual(5)
        expect(state.snake.positions[0].x).toBeGreaterThanOrEqual(0)
    })
})

describe("Snake direction", () => {
    test('should have different position after moving', async () => {
        const state = reducer(undefined, initializeGame({xMax: 5, yMax: 5}));
        const beforeMovePosition = {x: 0, y: 0}
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                positions: [beforeMovePosition],
                headDirection: SnakeHeadDirection.RIGHT
            }
        }

        const newState = reducer(modifiedState, moveSnake());

        const afterMovePosition = newState.snake.positions[0];
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
            const state = reducer(undefined, initializeGame({xMax: 4, yMax: 4}));
            const modifiedState: SnakeGameState = {
                ...state,
                snake: {
                    ...state.snake,
                    positions: [{x: 3, y: 3}],
                    headDirection: direction,
                }
            }

            const newState = reducer(modifiedState, moveSnake());

            const afterMovePosition = newState.snake.positions[0];
            expect(afterMovePosition.x).toBe(exception.x);
            expect(afterMovePosition.y).toBe(exception.y);
        }
    })

    test('cannot change the snake direction to where it come from', () => {
        const variants = [
            {
                headDirection: SnakeHeadDirection.RIGHT,
                positions: [{x: 1, y: 0}, {x: 0, y: 0}],
                goalDirection: SnakeHeadDirection.LEFT
            }, {
                headDirection: SnakeHeadDirection.LEFT,
                positions: [{x: 1, y: 1}, {x: 2, y: 1}],
                goalDirection: SnakeHeadDirection.RIGHT
            }, {
                headDirection: SnakeHeadDirection.UP,
                positions: [{x: 0, y: 1}, {x: 0, y: 2}],
                goalDirection: SnakeHeadDirection.DOWN
            }, {
                headDirection: SnakeHeadDirection.DOWN,
                positions: [{x: 1, y: 1}, {x: 1, y: 0}],
                goalDirection: SnakeHeadDirection.UP
            }
        ]

        for (const {headDirection, goalDirection, positions} of variants) {
            const state = reducer(undefined, initializeGame({xMax: 4, yMax: 4}));
            const modifiedState: SnakeGameState = {
                ...state,
                snake: {
                    ...state.snake,
                    positions,
                    headDirection,
                }
            }

            let newState = reducer(modifiedState, changeSnakeDirection(goalDirection));
            newState = reducer(newState, moveSnake());

            expect(newState.snake.headDirection).toBe(headDirection);
        }
    })

    test('change direction not working if game is over', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                headDirection: SnakeHeadDirection.RIGHT
            },
            isGameOver: true
        }

        const newState = reducer(modifiedState, changeSnakeDirection(SnakeHeadDirection.UP));

        expect(newState.isGameOver).toBe(true);
        expect(newState.snake.headDirection).toEqual(SnakeHeadDirection.RIGHT);
    })

    test('when direction is changed to the same direction then its not locking the turn', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                headDirection: SnakeHeadDirection.RIGHT,
                isTurnLocked: false
            },
        }

        const newState = reducer(modifiedState, changeSnakeDirection(SnakeHeadDirection.RIGHT));

        expect(newState.snake.isTurnLocked).toBe(false);
    })

    test('when direction is changed to different then it lock the turn until next move', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                headDirection: SnakeHeadDirection.RIGHT,
                isTurnLocked: false
            },
        }

        let newState = reducer(modifiedState, changeSnakeDirection(SnakeHeadDirection.UP));
        expect(newState.snake.isTurnLocked).toBe(true);

        newState = reducer(modifiedState, moveSnake());
        expect(newState.snake.isTurnLocked).toBe(false);
    })

    test('when turn is locked than cant change the direction until next move', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                positions: [{x: 0, y: 1}],
                headDirection: SnakeHeadDirection.RIGHT,
                isTurnLocked: true
            },
        }

        let newState = reducer(modifiedState, changeSnakeDirection(SnakeHeadDirection.UP));
        expect(newState.snake.headDirection).toBe(SnakeHeadDirection.RIGHT);

        newState = reducer(newState, moveSnake());
        newState = reducer(newState, changeSnakeDirection(SnakeHeadDirection.UP));
        expect(newState.snake.headDirection).toBe(SnakeHeadDirection.UP);
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
            const state = reducer(undefined, initializeGame({xMax: 4, yMax: 4}));
            const modifiedState: SnakeGameState = {
                ...state,
                apple: {
                    ...state.apple,
                    position: applePosition
                },
                snake: {
                    ...state.snake,
                    positions: [{x: 3, y: 3}],
                    headDirection: direction,
                }
            }

            const newState = reducer(modifiedState, moveSnake());

            expect(newState.snake.positions.length).toBe(2);
        }
    })

    test('should apple appear in different position when the snake eats the apple', () => {
        const state = reducer(undefined, initializeGame({xMax: 3, yMax: 2}));
        const beforeMoveApplePosition = {x: 3, y: 2}
        const modifiedState: SnakeGameState = {
            ...state,
            apple: {
                ...state.apple,
                position: beforeMoveApplePosition
            },
            snake: {
                ...state.snake,
                positions: [{x: 2, y: 2}],
                headDirection: SnakeHeadDirection.RIGHT,
            }
        }

        const newState = reducer(modifiedState, moveSnake());

        const afterMoveApplePosition = newState.apple.position;
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
            const state = reducer(undefined, initializeGame({xMax: 1, yMax: 1}));
            const modifiedState: SnakeGameState = {
                ...state,
                apple: {
                    ...state.apple,
                    position: variant.applePosition
                },
                snake: {
                    ...state.snake,
                    positions: variant.snakePositions,
                    headDirection: variant.snakeHeadDirection,
                }
            }

            const newState = reducer(modifiedState, moveSnake());

            expect(newState.apple.position.x).toBe(variant.newApplePosition.x);
            expect(newState.apple.position.y).toBe(variant.newApplePosition.y);
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
            const state = reducer(undefined, initializeGame({xMax: 1, yMax: 1}));
            const modifiedState: SnakeGameState = {
                ...state,
                snake: {
                    ...state.snake,
                    positions: variant.snakePositions,
                    headDirection: variant.headDirection,
                }
            }

            const newState = reducer(modifiedState, moveSnake());

            expect(newState.isGameOver).toBe(true);
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
            const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
            const modifiedState: SnakeGameState = {
                ...state,
                apple: {
                    ...state.apple,
                    position: {x: 2, y: 2}
                },
                snake: {
                    ...state.snake,
                    positions: variant.snakePositions,
                    headDirection: variant.headDirection,
                }
            }

            const newState = reducer(modifiedState, moveSnake());

            expect(newState.isGameOver).toBe(true);
        }
    })

    test('move not working if game is over', () => {
        const state = reducer(undefined, initializeGame({xMax: 2, yMax: 2}));
        const beforeMoveSnakeHeadPosition = {x: 1, y: 1}
        const modifiedState: SnakeGameState = {
            ...state,
            snake: {
                ...state.snake,
                positions: [beforeMoveSnakeHeadPosition],
            },
            isGameOver: true
        }

        const newState = reducer(modifiedState, moveSnake());

        expect(newState.isGameOver).toBe(true);
        expect(newState.snake.positions[0].x).toEqual(beforeMoveSnakeHeadPosition.x);
        expect(newState.snake.positions[0].y).toEqual(beforeMoveSnakeHeadPosition.y);
    })
})

describe('Snake move', () => {
    test('the snake length not changes if not eating the apple', () => {
        const state = reducer(undefined, initializeGame({xMax: 3, yMax: 3}));
        const modifiedState: SnakeGameState = {
            ...state,
            apple: {
                ...state.apple,
                position: {x: 2, y: 2}
            },
            snake: {
                ...state.snake,
                positions: [{x: 0, y: 0}],
                headDirection: SnakeHeadDirection.RIGHT
            },
        }

        const newState = reducer(modifiedState, moveSnake());

        expect(newState.snake.positions.length).toBe(1);
    })

    test('a longer snake length not changes after a move if not eating the apple', () => {
        const variants = [
            {headDirection: SnakeHeadDirection.RIGHT, snakePositions: [{x: 1, y: 0}, {x: 0, y: 0}]},
            {headDirection: SnakeHeadDirection.LEFT, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.UP, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.DOWN, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
        ]

        for (const variant of variants) {
            const state = reducer(undefined, initializeGame({xMax: 3, yMax: 3}));
            const modifiedState: SnakeGameState = {
                ...state,
                apple: {
                    ...state.apple,
                    position: {x: -1, y: -1}
                },
                snake: {
                    ...state.snake,
                    positions: [...variant.snakePositions],
                    headDirection: variant.headDirection
                },
            }

            const newState = reducer(modifiedState, moveSnake());

            expect(newState.snake.positions.length).toBe(variant.snakePositions.length);
        }
    })

    test('the snake cant break away after a move (every part follow the body)', () => {
        const variants = [
            {headDirection: SnakeHeadDirection.RIGHT, snakePositions: [{x: 1, y: 0}, {x: 0, y: 0}]},
            {headDirection: SnakeHeadDirection.LEFT, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.UP, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
            {headDirection: SnakeHeadDirection.DOWN, snakePositions: [{x: 1, y: 1}, {x: 2, y: 1}]},
        ]

        for (const variant of variants) {
            const state = reducer(undefined, initializeGame({xMax: 3, yMax: 3}));
            const modifiedState: SnakeGameState = {
                ...state,
                apple: {
                    ...state.apple,
                    position: {x: -1, y: -1}
                },
                snake: {
                    ...state.snake,
                    positions: variant.snakePositions,
                    headDirection: variant.headDirection
                },
            }

            const newState = reducer(modifiedState, moveSnake());

            for (let i = 0; i < newState.snake.positions.length - 1; i++) {
                expect(Math.abs(newState.snake.positions[i].x - newState.snake.positions[i + 1].x))
                    .toBeLessThanOrEqual(1);
                expect(Math.abs(newState.snake.positions[i].y - newState.snake.positions[i + 1].y))
                    .toBeLessThanOrEqual(1);
            }
        }
    })

})