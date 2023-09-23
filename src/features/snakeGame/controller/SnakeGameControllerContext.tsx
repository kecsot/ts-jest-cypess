import {createContext} from "react"
import {Position} from "../../../@types/position.type.ts";

export type SnakeGameControllerContextType = {
    columns: number
    rows: number

    initGame: (col: number, row: number) => void
    startGame: () => void
    restartGame: () => void

    score: number
    isGameOver: boolean

    snakePositions: Position[]
    isSnakePosition: (x: number, y: number) => boolean
    isApplePosition: (x: number, y: number) => boolean
}

const SnakeGameControllerContext = createContext<SnakeGameControllerContextType | null>(null)
export default SnakeGameControllerContext;