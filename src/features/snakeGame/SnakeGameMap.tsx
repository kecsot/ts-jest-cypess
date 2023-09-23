import {useSnakeGameControllerContext} from "./controller/useSnakeGameControllerContext.tsx";


export const SnakeGameMap = () => {

    const {
        columns,
        rows,
        isSnakePosition,
        isApplePosition
    } = useSnakeGameControllerContext()

    /**
     *  // TODO:
     *      Optimize rendering?
     *          Idea:
     *          - Render whole map only once
     *          - Render snake parts above the map
     */
    return (
        <table>
            <tbody>
            {Array.from({length: columns}, (_, y) => (
                <tr key={y}>
                    {Array.from({length: rows}, (_, x) => {
                        const isSnake = isSnakePosition(x, y)
                        const isApple = isApplePosition(x, y)

                        return (
                            <td key={x} style={{width: '1rem'}}>
                                {isSnake ? 's' : ''}
                                {isApple ? 'a' : ''}
                                {!isSnake && !isApple ? '-' : ''}
                            </td>
                        )
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
