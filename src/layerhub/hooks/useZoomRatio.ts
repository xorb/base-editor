import React from "react"
import { Context } from "../context"

export function useZoomRatio() {
  const { zoomRatio } = React.useContext(Context)

  return zoomRatio
}
