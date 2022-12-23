import { IScene } from "@layerhub-pro/types"
import React from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

export default function () {
  const { scenes } = React.useContext(DesignEditorContext)
  return scenes as Required<IScene>[]
}
