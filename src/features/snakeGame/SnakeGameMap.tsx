import {useSnakeGameControllerContext} from "./controller/useSnakeGameControllerContext.tsx";
import {useMemo} from "react";

type Props = {
    size: number;
};

export const SnakeGameMap = ({size}: Props) => {

    const {
        columns,
        rows,
        snakePositions,
        applePosition
    } = useSnakeGameControllerContext()

    const mapLayer = useMemo(() => {
        return (
            <div style={{
                display: "grid",
                width: `${size}px`,
                height: `${size}px`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: 0,
            }}>
                {Array.from({length: columns}, (_, y) => (
                    <div key={y}>
                        {Array.from({length: rows}, (_, x) => {
                            return (
                                <div
                                    key={`map-piece-${x}-${y}`}
                                    style={{
                                        background: 'black',
                                        height: `${size / rows}px`,
                                        width: `${size / columns}px`,
                                        padding: 0,
                                    }}
                                >
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        )
    }, [columns, rows, size])

    const snakeLayer = useMemo(() => {
        const pieceWidth = size / columns
        const pieceHeight = size / rows

        return (
            <>
                {snakePositions.map(({x, y}, index) => {
                    return (
                        <div
                            key={`snake-${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: `${x * pieceWidth}px`,
                                top: `${y * pieceHeight}px`,
                                width: `${pieceWidth}px`,
                                height: `${pieceHeight}px`,
                                background: index === 0 ? 'purple' : 'yellow',
                                borderRadius: '30%',
                                zIndex: 2,
                            }}
                        >
                        </div>
                    )
                })}
            </>
        )
    }, [columns, rows, size, snakePositions])

    const appleLayer = useMemo(() => {
        const pieceWidth = size / columns
        const pieceHeight = size / rows

        return (
            <div
                key='apple'
                style={{
                    position: 'absolute',
                    left: `${applePosition.x * pieceWidth}px`,
                    top: `${applePosition.y * pieceHeight}px`,
                    width: `${pieceWidth}px`,
                    height: `${pieceHeight}px`,
                    background: 'green',
                    borderRadius: '50%',
                    zIndex: 2,
                }}>
            </div>
        )
    }, [applePosition, size, columns, rows])

    return (
        <div style={{
            position: 'relative',
        }}>
            {mapLayer}
            {snakeLayer}
            {appleLayer}
        </div>
    )
}
