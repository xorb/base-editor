import { fabric } from "fabric"
import { FabricCanvas, IState } from "../common/interfaces"

// state canvas
interface ZoomOptions {
  canvas: FabricCanvas
  state: IState
}
class Zoom {
  private canvas: FabricCanvas
  private state: IState
  constructor(options: ZoomOptions) {
    this.canvas = options.canvas
    this.state = options.state
  }
  zoomIn() {
    let zoomRatio = this.canvas.getZoom()
    zoomRatio += 0.05
    const center = this.canvas.getCenter()
    this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio)
    this.state.setZoomRatio(zoomRatio)
  }

  zoomOut() {
    let zoomRatio = this.canvas.getZoom()
    zoomRatio -= 0.05
    const center = this.canvas.getCenter()
    this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio)
    this.state.setZoomRatio(zoomRatio)
  }

  zoomToOne() {
    const center = this.canvas.getCenter()
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    this.zoomToPoint(new fabric.Point(center.left, center.top), 1)
    this.state.setZoomRatio(1)
  }

  zoomToFit(zoomFitRatio: number) {
    const center = this.canvas.getCenter()
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    this.zoomToPoint(new fabric.Point(center.left, center.top), zoomFitRatio)
    this.state.setZoomRatio(zoomFitRatio)
  }

  zoomToRatio(zoomRatio: number) {
    const center = this.canvas.getCenter()
    this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio)
    this.state.setZoomRatio(zoomRatio)
  }

  zoomToPoint(point: fabric.Point, zoom: number) {
    const minZoom = 10
    const maxZoom = 5000
    let zoomRatio = zoom
    if (zoom <= minZoom / 100) {
      zoomRatio = minZoom / 100
    } else if (zoom >= maxZoom / 100) {
      zoomRatio = maxZoom / 100
    }

    this.canvas.zoomToPoint(point, zoomRatio)
    this.state.setZoomRatio(zoomRatio)
  }
}

export default Zoom
