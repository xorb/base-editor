import React from "react"
import { Context } from "../context"

export function useIsFreeDrawing() {
  const { isFreeDrawing } = React.useContext(Context)
  return isFreeDrawing
}
