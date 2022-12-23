import React from "react"
import { Context } from "../context"

export function useDesign() {
  const { design } = React.useContext(Context)
  return design
}
