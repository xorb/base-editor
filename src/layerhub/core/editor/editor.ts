import Canvas from "./canvas"
import State from "./state"
import Zoom from "./zoom"
import EventManager from "./event-manager"
import { IState } from "../common/interfaces"
import { IConfig, IDesign } from "@layerhub-pro/types"
import { getFitRatio } from "../utils/zoom"
import Design from "../design/design"
import Config from "../common/config"
import { createDesign } from "../utils/design"
import CanvasEvents from "./canvas-events"
import Drawer from "./drawer"
import FreeDrawer from "./free-drawer"

const ZERO = 0

interface Options {
  design?: IDesign
  state?: IState
  config?: Partial<IConfig>
  id: string
}
export class Editor extends EventManager {
  public canvas: Canvas
  public zoom: Zoom
  public state: IState
  public canvasId: string
  public design: Design
  public drawer: Drawer
  public freeDrawer: FreeDrawer
  private config: Config
  private events: CanvasEvents
  constructor({ id, state, config }: Options) {
    super()
    this.state = state ? state : new State()
    this.config = new Config(config)
    this.canvasId = id
    this.initCanvas()
    this.init()
    this.state.setEditor(this)
  }

  public initCanvas = () => {
    const canvas = new Canvas({
      id: this.canvasId,
      config: this.config,
      editor: this,
    })
    this.canvas = canvas
  }

  public initConfig = () => {}

  public init = () => {
    setTimeout(() => {
      this.zoom = new Zoom({
        canvas: this.canvas.canvas,
        state: this.state,
      })
      // @ts-ignore
      const design = createDesign()
      // const design = data as IDesign
      const fitRatio = getFitRatio(design.frame, this.canvas.canvas, this.config)

      this.design = new Design({
        editor: this,
        canvas: this.canvas.canvas,
        design: design,
        config: this.config,
        state: this.state,
      })
      this.events = new CanvasEvents({
        canvas: this.canvas.canvas,
        design: this.design,
        editor: this,
      })
      this.zoom.zoomToFit(fitRatio)
      this.state.setDesign(this.design)
      this.drawer = new Drawer(this.canvas.canvas, this)
      this.freeDrawer = new FreeDrawer(this.canvas.canvas, this)
    }, ZERO)
  }

  public debug() {
    console.log({
      design: this.design.toJSON(),
      current: this.canvas.canvas.toJSON(),
    })
  }

  public destroy() {
    this.canvas.destroy()
  }

  // CONTEXT MENU
  public cancelContextMenuRequest = () => {
    this.state.setContextMenuRequest(null)
  }
  public cancelParamMenuRequest = () => {
    this.state.setParamMenuRequest(null)
  }
}
