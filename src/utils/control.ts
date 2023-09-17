import {Position, SnakeMap} from "../@types/map.type.ts";
import {SnakeHeadDirection} from "../@types/snake.type.ts";
import {generateDifferentPositionThanThese} from "./position.ts";

export const nextSnakeMove = (map: SnakeMap) => {
    if (map.isGameOver) {
        throw new Error("The game is over")
    }

    const snakeHeadX = map.snake.positions[0].x
    const snakeHeadY = map.snake.positions[0].y
    const isLeftMove = map.snake.headDirection === SnakeHeadDirection.LEFT;
    const isRightMove = map.snake.headDirection === SnakeHeadDirection.RIGHT;

    // Find possible move
    let possibleNewPosition: Position;
    if (isLeftMove || isRightMove) {
        possibleNewPosition = {
            x: isLeftMove ? snakeHeadX - 1 : snakeHeadX + 1,
            y: snakeHeadY
        }
    } else {
        const isUpMove = map.snake.headDirection === SnakeHeadDirection.UP;

        possibleNewPosition = {
            x: snakeHeadX,
            y: isUpMove ? snakeHeadY - 1 : snakeHeadY + 1
        }
    }

    // Validate possible move
    const isSnakeHitsTheWall =
        possibleNewPosition.y < 0 || possibleNewPosition.y > map.col ||
        possibleNewPosition.x < 0 || possibleNewPosition.x > map.row

    let isGameOver = isSnakeHitsTheWall;

    if (!isGameOver) {
        const inOwnHit = map.snake.positions.some(position => {
            return position.x === possibleNewPosition.x && position.y === possibleNewPosition.y
        })

        isGameOver = inOwnHit;
    }


    if (isGameOver) {
        map.isGameOver = true;
    } else {
        map.snake.positions.unshift(possibleNewPosition)

        const isSnakeEatsApple = possibleNewPosition.y === map.apple.position.y && possibleNewPosition.x === map.apple.position.x
        if (isSnakeEatsApple) {
            /*
                 TODO:
                 Rework. It's a 'brute force' generation.
                 Performance will not be great. If the map and the snake will be too big.

                 We should store empty positions, shuffle it, and return one from it.
             */
            map.apple.position = generateDifferentPositionThanThese(map.snake.positions, map.col, map.row)
        } else {
            map.snake.positions.pop()
        }
    }
}

/**
 * Not just change the direction if new is different.
 * It can occur errors if the user can change two times per frame.
 * We should validate it used the second part of the snake.
 *
 * @param map
 * @param newDirection
 */
export const changeSnakeHeadDirection = (map: SnakeMap, newDirection: SnakeHeadDirection) => {
    if (map.snake.positions.length === 1) {
        map.snake.headDirection = newDirection;
    } else {
        let cannotTurnTo: SnakeHeadDirection;
        const headPosition = map.snake.positions[0];
        const secondPartPosition = map.snake.positions[1]

        const isSnakeGoingUpOrDown = secondPartPosition.x === headPosition.x
        if (isSnakeGoingUpOrDown) {
            const isSnakeGoingUp = secondPartPosition.y > headPosition.y

            cannotTurnTo = isSnakeGoingUp ? SnakeHeadDirection.DOWN : SnakeHeadDirection.UP
        } else {
            const isSnakeGoingLeft = secondPartPosition.x > headPosition.x

            cannotTurnTo = isSnakeGoingLeft ? SnakeHeadDirection.RIGHT : SnakeHeadDirection.LEFT
        }

        if (cannotTurnTo !== newDirection) {
            map.snake.headDirection = newDirection
        }
    }
}