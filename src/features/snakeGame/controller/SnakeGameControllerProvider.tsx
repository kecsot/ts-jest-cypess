import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import SnakeGameControllerContext, {SnakeGameControllerContextType} from "./SnakeGameControllerContext.tsx";
import {SnakeHeadDirection} from "../../../@types/snake.type.ts";
import {
    changeSnakeDirection,
    initializeGame,
    moveSnake,
    selectApplePosition,
    selectIsGameOver,
    selectSnakePositions
} from "../redux/snakeGameSlice.ts";
import {useAppDispatch} from "../../../hooks/redux/useAppDispatch.ts";
import {useAppSelector} from "../../../hooks/redux/useAppSelector.ts";

export type Props = {
    children: ReactNode
}

export function SnakeGameControllerProvider({children}: Props) {
    const dispatch = useAppDispatch()
    const snakePositions = useAppSelector(selectSnakePositions)
    const applePosition = useAppSelector(selectApplePosition)
    const isGameOver = useAppSelector(selectIsGameOver)
    const [columns, setColumns] = useState<number | undefined>()
    const [rows, setRows] = useState<number | undefined>()

    const handleKeyPress = useCallback((e: { key: string; }) => {
        const key = e.key
        let changeSnakeDirectionTo: SnakeHeadDirection | undefined

        if (key === 'ArrowUp') changeSnakeDirectionTo = SnakeHeadDirection.UP
        else if (key === 'ArrowDown') changeSnakeDirectionTo = SnakeHeadDirection.DOWN
        else if (key === 'ArrowLeft') changeSnakeDirectionTo = SnakeHeadDirection.LEFT
        else if (key === 'ArrowRight') changeSnakeDirectionTo = SnakeHeadDirection.RIGHT

        if (changeSnakeDirectionTo) {
            dispatch(changeSnakeDirection(changeSnakeDirectionTo))
        }
    }, [dispatch])


    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress, false)

        return () => window.removeEventListener('keydown', handleKeyPress, false)
    }, [])

    const callNextMove = useCallback(() => {
        setTimeout(() => {
            if (!isGameOver) {
                dispatch(moveSnake())
                callNextMove()
            }
        }, 200)
    }, [isGameOver, dispatch])

    const startGame = useCallback(callNextMove, [callNextMove])

    const restartGame = useCallback(() => {
        if (!columns || !rows) throw new Error('Col and Row are required')
        dispatch(initializeGame({xMax: columns - 1, yMax: rows - 1}))
        callNextMove()
    }, [columns, rows, dispatch, callNextMove])

    const initGame = useCallback((col: number, row: number) => {
        setColumns(col)
        setRows(row)
        dispatch(initializeGame({xMax: col - 1, yMax: row - 1}))
    }, [dispatch])

    const score = useMemo(() => {
        return snakePositions.length - 1
    }, [snakePositions.length])

    const value = useMemo(
        () => ({
            columns,
            rows,

            initGame,
            startGame,
            restartGame,

            score,
            isGameOver,

            snakePositions,
            applePosition
        } as SnakeGameControllerContextType), [columns, rows, initGame, startGame, restartGame, score, isGameOver, snakePositions, applePosition])

    return (
        <SnakeGameControllerContext.Provider value={value}>
            {children}
        </SnakeGameControllerContext.Provider>
    );
}