import {configureStore} from '@reduxjs/toolkit'
import snakeGameSlice from "../features/map/snakeGameSlice.ts";

const store = configureStore({
    reducer: {
        snakeGame: snakeGameSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store