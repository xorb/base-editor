import throttle from "lodash/throttle"
import { CanvasJSON } from "../common/interfaces"
import type Scene from "./scene"

class History {
  private redos: CanvasJSON[] = []
  private undos: CanvasJSON[] = []
  private current: CanvasJSON
  private isActive: boolean = false

  constructor(public scene: Scene) {
    this.redos = []
    this.undos = []
  }

  public setCurrent = () => {
    const json = this.getJSON()
    this.current = json
  }

  private getJSON() {
    const json = this.scene.toJSONNative()
    const updatedJSON = {
      ...json,
      objects: json.objects.map((object) => {
        object.clipPath = null
        return object
      }),
    }
    return updatedJSON
  }

  public getStatus = () => {
    return {
      hasUndo: this.undos.length >= 1,
      hasRedo: this.redos.length > 0,
      undos: this.undos,
      redos: this.redos,
      state: this.current,
    }
  }

  public save = () => {
    try {
      this.undos.push(this.current)
      this.current = this.getJSON()
    } catch (err) {
      console.log(err)
    }
    this.emitStatus()
  }

  public undo = throttle(() => {
    if (this.undos.length >= 1) {
      const undo = this.undos.pop()
      if (!undo) {
        return
      }
      this.redos.push(this.current)
      this.restore(undo)
    }
  }, 100)

  public redo = throttle(() => {
    const redo = this.redos.pop()
    if (!redo) {
      return
    }
    this.undos.push(this.current)
    this.restore(redo)
  }, 100)

  private restore = (transaction: any) => {
    if (!this.isActive) {
      this.scene.canvas.loadFromJSON(transaction, () => {
        this.scene.canvas.requestRenderAll()
        this.scene.setClipping()
        this.current = this.getJSON()
        setTimeout(() => {
          this.emitStatus()
        }, 150)
      })
    }
  }

  public reset = () => {
    this.redos = []
    this.undos = []
    this.emitStatus()
  }

  public emitStatus = async () => {
    this.scene.updateLoadedObjects()
    await this.scene.setPreview()
    this.scene.editor.emit("history:updated", this.scene)
    this.scene.editor.design.updateContext()
  }

  public get status() {
    return {
      undos: this.undos,
      redos: this.redos,
      current: this.current,
    }
  }
}

export default History
