import { createReducer } from "@reduxjs/toolkit"
import { setFrames } from "./actions"
import { IFrame } from "@layerhub-pro/types"

export interface FramesState {
  frames: IFrame[]
}

const initialState: FramesState = {
  frames: [],
}

export const framesReducer = createReducer(initialState, (builder) => {
  builder.addCase(setFrames, (state, { payload }) => {
    state.frames = payload
  })
})
