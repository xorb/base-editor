import React from "react"
import { type Scene } from "@layerhub-pro/core"
import { Context } from "../context"

export function useScenes() {
  const { scenes } = React.useContext(Context)

  return scenes as Scene[]
}
