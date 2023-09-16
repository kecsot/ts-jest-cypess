import {SnakeMap} from "../@types/map.type.ts";
import {generateDifferentPosition} from "./position.ts";
import {Apple} from "../@types/apple.type.ts";
import {Snake, SnakeHeadDirection} from "../@types/snake.type.ts";

/**
 * TODO:
 *      The snake should start in the center of the map.
 *      Would generate apple position after the snake
 *
 * @param col
 * @param row
 */
const createMap = (col: number, row: number): SnakeMap => {
    const apple: Apple = {
        position: {
            x: Math.floor(Math.random() * col),
            y: Math.floor(Math.random() * row)
        }
    }

    const snakeStartPosition = generateDifferentPosition(apple.position, col, row)
    const snake: Snake = {
        positions: [snakeStartPosition],
        headDirection: SnakeHeadDirection.RIGHT
    }

    return {
        col,
        row,
        apple,
        snake
    } as SnakeMap;
}

export default createMap;