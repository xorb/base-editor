import * as React from "react"
import { IState, Scene } from "@layerhub-pro/core"

const Context = React.createContext<IState>({
  zoomRatio: 1,
  activeObject: null,
  activeScene: null,
  contextMenuRequest: null,
  frame: null,
  background: null,
  objects: [],
  scenes: [],
  editor: null,
  design: null,
  paramMenuRequest: null,
  isFreeDrawing: false,
  setActiveObject: () => {},
  setActiveScene: () => {},
  setContextMenuRequest: () => {},
  setFrame: () => {},
  setBackground: () => {},
  setObjects: () => {},
  setScenes: () => {},
  setZoomRatio: () => {},
  setEditor: () => {},
  setDesign: () => {},
  setParamMenuRequest: () => {},
  setIsFreeDrawing: () => {},
})

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [zoomRatio, setZoomRatio] = React.useState(1)
  const [activeObject, setActiveObject] = React.useState(null)
  const [isFreeDrawing, setIsFreeDrawing] = React.useState(false)
  const [activeScene, setActiveScene] = React.useState<Scene | null>(null)
  const [frame, setFrame] = React.useState(null)
  const [background, setBackground] = React.useState(null)
  const [editor, setEditor] = React.useState(null)
  const [design, setDesign] = React.useState(null)
  const [contextMenuRequest, setContextMenuRequest] = React.useState(null)
  const [objects, setObjects] = React.useState([])
  const [scenes, setScenes] = React.useState([])
  const [paramMenuRequest, setParamMenuRequest] = React.useState(null)

  return (
    <Context.Provider
      value={{
        zoomRatio,
        setZoomRatio,
        activeObject,
        setActiveObject,
        frame,
        setFrame,
        contextMenuRequest,
        setContextMenuRequest,
        objects,
        setObjects,
        editor,
        setEditor,
        scenes,
        setScenes,
        activeScene,
        setActiveScene,
        paramMenuRequest,
        setParamMenuRequest,
        background,
        setBackground,
        design,
        setDesign,
        isFreeDrawing,
        setIsFreeDrawing,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export { Context, Provider }
