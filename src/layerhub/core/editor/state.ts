import { IState } from "../common/interfaces"

export default class State implements IState {
  public frame = null
  public background: any
  public activeObject = null
  public activeScene = null
  public objects = []
  public scenes: any[]
  public zoomRatio = 1
  public contextMenuRequest = null
  public editor = null
  public paramMenuRequest = null
  public design = null
  public isFreeDrawing = false
  public setFrame(o: any) {
    this.frame = o
  }
  public setActiveObject(o: any) {
    this.activeObject = o
  }
  public setActiveScene(o: any) {
    this.activeScene = o
  }
  public setObjects(o: any) {
    this.objects = o
  }
  public setScenes(o: any) {
    this.scenes = o
  }
  public setDesign(o: any) {
    this.design = o
  }
  public setIsFreeDrawing(o: boolean) {
    this.isFreeDrawing = o
  }
  public setZoomRatio(o: any) {
    this.zoomRatio = o
  }
  public setContextMenuRequest(o: any) {
    this.contextMenuRequest = o
  }
  public setEditor(o: any) {
    this.editor = o
  }
  public setBackground(o: any) {
    this.background = o
  }
  public setParamMenuRequest(o: any) {
    this.paramMenuRequest = o
  }
}
