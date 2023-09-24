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
    applePosition: Position
}

const SnakeGameControllerContext = createContext<SnakeGameControllerContextType | null>(null)
export default SnakeGameControllerContext;