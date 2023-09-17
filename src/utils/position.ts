import {Position} from "../@types/map.type.ts";
import {generateDifferentValueBetween} from "./math.ts";

const generateDifferentPositionThan = (position: Position, maxX: number, maxY: number): Position => {
    if (maxX <= 0 || maxY <= 0) throw new Error('maxX or maxY must be greater than zero');

    return {
        x: generateDifferentValueBetween(position.x, 0, maxX),
        y: generateDifferentValueBetween(position.y, 0, maxY)
    } as Position;
}

export {
    generateDifferentPositionThan,
};