import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "../../../store";
import {generateDifferentPositionThan, generateDifferentPositionThanThese} from "../../../utils/position.ts";
import {Position} from "../../../@types/position.type.ts";
import {SnakeHeadDirection} from "../../../@types/snake.type.ts";


export interface SnakeGameState {
    isGameOver: boolean,
    map: {
        xMax: number
        yMax: number
    }
    apple: {
        position: Position
    }
    snake: {
        positions: Position[]
        headDirection: SnakeHeadDirection
        isTurnLocked: boolean
    }
}

const initialState: SnakeGameState = {
    isGameOver: false,
    map: {
        xMax: 0,
        yMax: 0
    },
    apple: {
        position: {x: -1, y: -1}
    },
    snake: {
        positions: [{x: 0, y: 0}],
        headDirection: SnakeHeadDirection.RIGHT,
        isTurnLocked: false
    }
}

const isSnakeHitsTheWallFn = (snakeHeadPosition: Position, xMax: number, yMax: number) =>
    snakeHeadPosition.y < 0 || snakeHeadPosition.y > yMax ||
    snakeHeadPosition.x < 0 || snakeHeadPosition.x > xMax

const isSnakeHitsTheAppleFn = (snakeHeadPosition: Position, applePosition: Position) =>
    snakeHeadPosition.x === applePosition.x && snakeHeadPosition.y === applePosition.y

const isSnakeHitsTheSnakeFn = (headPosition: Position, snakePositions: Position[]) => {
    for (let i = 0; i < snakePositions.length; i++) {
        if (headPosition.x === snakePositions[i].x &&
            headPosition.y === snakePositions[i].y) {
            return true
        }
    }
    return false
}

export const snakeGameSlice = createSlice({
    name: 'snakeGame',
    initialState,
    reducers: {
        initializeGame: (_, action: PayloadAction<{ xMax: number, yMax: number }>) => {
            const xMax = action.payload.xMax
            const yMax = action.payload.yMax
            if (xMax < 1 || yMax < 1) throw new Error('xMax and yMax must be greater than 0')

            const snakePosition = {
                x: Math.floor(xMax / 2),
                y: Math.floor(yMax / 2)
            }
            const applePosition = generateDifferentPositionThan(snakePosition, xMax, yMax)
            return {
                isGameOver: false,
                map: {
                    xMax,
                    yMax,
                },
                apple: {
                    position: applePosition
                },
                snake: {
                    positions: [snakePosition],
                    headDirection: SnakeHeadDirection.RIGHT,
                    isTurnLocked: false
                }
            }
        },
        moveSnake: (state) => {
            if (state.isGameOver) return
            state.snake.isTurnLocked = false

            const snakeHeadX = state.snake.positions[0].x
            const snakeHeadY = state.snake.positions[0].y
            const isLeftMove = state.snake.headDirection === SnakeHeadDirection.LEFT;
            const isRightMove = state.snake.headDirection === SnakeHeadDirection.RIGHT;

            const newPosition = {...state.snake.positions[0]}
            if (isLeftMove || isRightMove) {
                newPosition.x = isLeftMove ? snakeHeadX - 1 : snakeHeadX + 1
            } else {
                const isUpMove = state.snake.headDirection === SnakeHeadDirection.UP;
                newPosition.y = isUpMove ? snakeHeadY - 1 : snakeHeadY + 1
            }

            if (isSnakeHitsTheWallFn(newPosition, state.map.xMax, state.map.yMax) ||
                isSnakeHitsTheSnakeFn(newPosition, state.snake.positions)) {
                state.isGameOver = true;
            } else {
                state.snake.positions.unshift(newPosition)

                if (isSnakeHitsTheAppleFn(newPosition, state.apple.position)) {
                    /*
                         TODO:
                         Rework. It's a 'brute force' generation.
                         Performance will not be great. If the map and the snake will be too big.

                         We should store empty positions, shuffle it, and return one from it.
                     */
                    state.apple.position = generateDifferentPositionThanThese(state.snake.positions, state.map.xMax, state.map.yMax)
                } else {
                    state.snake.positions.pop()
                }
            }
        },
        changeSnakeDirection: (state, action: PayloadAction<SnakeHeadDirection>) => {
            if (state.isGameOver) return
            if (state.snake.isTurnLocked) return

            const currentHeadDirection = state.snake.headDirection
            const newHeadDirection = action.payload

            if (newHeadDirection === currentHeadDirection) return
            if (newHeadDirection === SnakeHeadDirection.UP && currentHeadDirection === SnakeHeadDirection.DOWN) return;
            if (newHeadDirection === SnakeHeadDirection.DOWN && currentHeadDirection === SnakeHeadDirection.UP) return;
            if (newHeadDirection === SnakeHeadDirection.LEFT && currentHeadDirection === SnakeHeadDirection.RIGHT) return;
            if (newHeadDirection === SnakeHeadDirection.RIGHT && currentHeadDirection === SnakeHeadDirection.LEFT) return;

            state.snake.isTurnLocked = true
            state.snake.headDirection = action.payload;
        },
    },
})

export const {
    initializeGame,
    moveSnake,
    changeSnakeDirection
} = snakeGameSlice.actions

export const selectSnakePositions = (state: RootState) => state.snakeGame.snake.positions
export const selectApplePosition = (state: RootState) => state.snakeGame.apple.position
export const selectIsGameOver = (state: RootState) => state.snakeGame.isGameOver

export default snakeGameSlice.reducer