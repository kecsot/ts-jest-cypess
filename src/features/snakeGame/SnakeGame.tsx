import {useSnakeGameControllerContext} from "./controller/useSnakeGameControllerContext.tsx";
import {useEffect} from "react";
import {SnakeGameMap} from "./SnakeGameMap.tsx";

export const SnakeGame = () => {
    const col = 20
    const row = 20

    const {
        isGameOver,
        score,
        startGame,
        restartGame,
        initGame,
    } = useSnakeGameControllerContext()

    useEffect(() => {
        initGame(col, row)
    }, [])

    return (
        <>
            <div>Score: {score}</div>
            {isGameOver && <div>Game Over!</div>}
            <div>
                {!isGameOver && (
                    <button onClick={startGame}>Start Game</button>
                )}
                {isGameOver && (
                    <button onClick={restartGame}>Restart Game</button>
                )}
            </div>
            <SnakeGameMap size={500}/>
        </>
    )
}
