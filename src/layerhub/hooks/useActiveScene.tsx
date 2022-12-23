import React from "react"
import { type Scene } from "@layerhub-pro/core"
import { Context } from "../context"

export function useActiveScene() {
  const { activeScene } = React.useContext(Context)

  return activeScene as Scene
}
