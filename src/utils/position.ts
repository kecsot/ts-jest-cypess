import {Position} from "../@types/map.type.ts";
import {generateDifferentValueBetween} from "./math.ts";

const generateDifferentPositionThan = (position: Position, maxX: number, maxY: number): Position => {
    if (maxX <= 0 || maxY <= 0) throw new Error('maxX or maxY must be greater than zero');

    return {
        x: generateDifferentValueBetween(position.x, 0, maxX),
        y: generateDifferentValueBetween(position.y, 0, maxY)
    } as Position;
}

// TODO: this will be removed. Not covered with tests.
const generateDifferentPositionThanThese = (positions: Position[], maxX: number, maxY: number): Position => {
    if (maxX <= 0 || maxY <= 0) throw new Error('maxX or maxY must be greater than zero');

    const countOfAllPossibleSolution = (maxX + 1) * (maxY + 1);
    if (countOfAllPossibleSolution === positions.length) throw new Error('There is no possible solution');

    const possibleNewPosition = {
        x: Math.floor(Math.random() * (maxX + 1)),
        y: Math.floor(Math.random() * (maxY + 1))
    } as Position

    const found = positions.find((position) => {
        return position.x === possibleNewPosition.x && position.y === possibleNewPosition.y;
    });

    return found ? generateDifferentPositionThanThese(positions, maxX, maxY) : possibleNewPosition;
}

export {
    generateDifferentPositionThan,
    generateDifferentPositionThanThese
};