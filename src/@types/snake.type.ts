import {Position} from "./map.type.ts";

export enum SnakeHeadDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export type Snake = {
    positions: Position[]
    headDirection: SnakeHeadDirection
}