import React from "react"
import { Context } from "../context"

export function useParamMenuRequest() {
  const { paramMenuRequest } = React.useContext(Context)
  return paramMenuRequest
}
