import { RootState } from "~/store/rootReducer"

export const selectFrames = (state: RootState) => state.frames.frames
