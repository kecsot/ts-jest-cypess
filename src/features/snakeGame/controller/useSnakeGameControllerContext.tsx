import {useContext} from "react";
import SnakeGameControllerContext from "./SnakeGameControllerContext.tsx";

export const useSnakeGameControllerContext = () => {
    const context = useContext(SnakeGameControllerContext);
    if (!context) {
        throw new Error("useSnakeGameControllerContext can only be used inside SnakeGameControllerProvider");
    }
    return context;
};