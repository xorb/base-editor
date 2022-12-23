import { createAsyncThunk, createAction } from "@reduxjs/toolkit"
import api from "~/services/api"
import { IFrame } from "@layerhub-pro/types"

export const setFrames = createAction<IFrame[]>("frames/setFrames")

export const getFrames = createAsyncThunk<void, never, { rejectValue: Record<string, string[]> }>(
  "frames/getFrames",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const frames = await api.getFrames()
      dispatch(setFrames(frames))
    } catch (err) {
      return rejectWithValue((err as any).response?.data?.error.data || null)
    }
  }
)
