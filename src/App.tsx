import {SnakeGame} from "./features/snakeGame/SnakeGame.tsx";
import {SnakeGameControllerProvider} from "./features/snakeGame/controller/SnakeGameControllerProvider.tsx";

function App() {

    return (
        <>
            <SnakeGameControllerProvider>
                <SnakeGame/>
            </SnakeGameControllerProvider>
        </>
    )
}

export default App
