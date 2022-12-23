import { fabric } from "fabric"
import { groupBy, uniqueId, pick } from "lodash"

const REGEX_VAR = new RegExp(/\`[\s*a-zA-Z0-9-_]+?\`/g)

interface Param {
  id: string
  key: string
  startIndex: number
  endIndex: number
  name: string
}

export class StaticTextObject extends fabric.Textbox {
  static type = "StaticText"
  public fontURL: string = ""
  public params: Param[] = []
  public paramBounds: any[] = []

  private getParamsFromKeys(text: string): Param[] {
    let params: Param[] = []
    const matches = text.matchAll(REGEX_VAR)
    for (const match of matches) {
      const matchWord = match["0"]
      const startIndex = match["index"]
      params = params.concat({
        key: matchWord,
        startIndex: startIndex!,
        endIndex: startIndex! + matchWord.length,
        id: uniqueId(matchWord),
        name: matchWord
          .slice(1, matchWord.length - 1)
          .toLowerCase()
          .split(" ")
          .join("_"),
      })
    }
    return params
  }

  private registerHoverEvent() {
    this.canvas!.on("mouse:move", (e) => {
      if (!this.isEditing && e.target === this) {
        const pointer = this.canvas!.getPointer(e.e, false)
        const key = this.paramBounds.find((key) => {
          if (
            pointer.x >= key.left + this.left &&
            pointer.x <= this.left + key.left + key.width &&
            pointer.y >= key.top + this.top &&
            pointer.y <= this.top + key.top + key.height
          ) {
            return true
          } else {
            return false
          }
        })
        if (key) {
          this.hoverCursor = "pointer"
        } else {
          this.hoverCursor = "move"
        }
      }
    })
  }
  initialize(options: StaticTextOptions) {
    const { text, params, ...textOptions } = options
    this.params = params ? params : []
    this.paramBounds = []
    //@ts-ignore
    super.initialize(text, { ...textOptions })

    this.on("added", () => {
      this.registerHoverEvent()
      this.updateParams()
    })
    this.on("editing:entered", () => {
      this.clearStyles()
    })
    this.on("editing:exited", () => {
      this.updateParams()
    })

    this.on("modified", () => {
      this.updateParams()
    })

    this.on("mouseup", this.handleMouseUp)

    return this
  }

  handleMouseUp(e: fabric.IEvent<Event>) {
    if (!this.isEditing) {
      const pointer = this.canvas!.getPointer(e.e, false)
      // @ts-ignore
      const param = this.paramBounds.find((param) => {
        if (
          pointer.x >= param.left + this.left &&
          pointer.x <= this.left + param.left + param.width &&
          pointer.y >= param.top + this.top &&
          pointer.y <= this.top + param.top + param.height
        ) {
          return true
        } else {
          return false
        }
      })
      if (param) {
        const zoom = this.canvas!.getZoom()
        const { scaleX, scaleY, width, height } = this
        const { left, top } = this.getBoundingRect(false)
        const padLeft = (width! * scaleX! * zoom - width!) / 2
        const padTop = (height! * scaleY! * zoom - height!) / 2

        const eventData = {
          object: this,
          position: {
            left: left + padLeft + param.width * zoom + param.left,
            top: top + padTop + param.height * zoom + param.top,
          },
          param,
        }
        this.canvas!.fire("param:selected", eventData)
      }
    }
  }
  updateParam(key: string, name: string) {
    this.params = this.params.map((p) => {
      if (p.key === key) {
        return {
          ...p,
          name,
        }
      }
      return p
    })
    this.updateParams()
  }
  setParams() {
    const params = this.getParamsFromKeys(this.text!)

    if (this.params) {
      const updatedParams = params.map((param) => {
        const existingParam = this.params.find((p) => p.key === param.key)
        if (existingParam) {
          return {
            ...param,
            name: existingParam.name,
          }
        }
        return param
      })
      this.params = updatedParams
    } else {
      this.params = params
    }

    this.params.forEach((param) => {
      const size = param.endIndex - param.startIndex
      const fillText = Array(size).fill("M")
      const fillStyle = Array(size).fill({
        textBackgroundColor: "#dcdde1",
        key: param.key,
        id: param.id,
        name: param.name,
      })
      this.insertNewStyleBlock(fillText, param.startIndex, fillStyle)
    })
  }

  setParamBounds() {
    setTimeout(() => {
      let textLines = this.getUpdatedTextLines()
      let paramBounds: any[] = []
      textLines.forEach((textLine) => {
        const lineHeight = this.__lineHeights[parseInt(textLine.textStyleGroupIndex)]
        const params = this.getKeysFromTextStyles(textLine.lineStyles)
        const linekeyBounds = params.map((param) => {
          const charBounds = this.__charBounds![textLine.lineIndex].map((cbs) => ({
            ...cbs,
            top: lineHeight * textLine.lineIndex,
          }))
          const charBoundMin = charBounds[param.startIndex - textLine.startIndex]
          const charBoundMax = charBounds[param.endIndex - 1 - textLine.startIndex]
          if (!charBoundMin || !charBoundMax) {
            return {}
          }
          const lineWidth = this.__lineWidths[textLine.lineIndex]
          const width = this.width!
          let shift = 0
          if (this.textAlign === "center") {
            shift = (width - lineWidth) / 2
          } else if (this.textAlign === "right") {
            shift = width - lineWidth
          }
          const charBound = {
            ...charBoundMin,
            ...param,
            shift,
            left: shift + charBoundMin.left,
            top: charBoundMin.top,
            width: charBoundMax.width + charBoundMax.left - charBoundMin.left,
            height: charBoundMin.height,
          }
          return charBound
        })
        paramBounds = paramBounds.concat(linekeyBounds)
      })
      this.paramBounds = paramBounds
    }, 250)
  }

  getKeysFromTextStyles(textSyles: any) {
    let charStyles: any[] = []
    let params: any[] = []
    Object.keys(textSyles).forEach((style) => {
      if (textSyles[style].key) {
        charStyles = charStyles.concat({
          index: parseInt(style),
          key: textSyles[style].key,
          id: textSyles[style].id,
          name: textSyles[style].name,
        })
      }
    })

    const groupedCharStyles = groupBy(charStyles, "id")
    Object.keys(groupedCharStyles).forEach((group) => {
      const size = groupedCharStyles[group].length
      const key = groupedCharStyles[group][0].key
      const name = groupedCharStyles[group][0].name
      const indexes = groupedCharStyles[group].map((g) => g.index).sort((a, b) => a - b)
      const [startIndex] = [indexes[0]]
      const param = {
        key,
        startIndex,
        name,
        endIndex: startIndex + size,
        id: group,
      }
      params = params.concat(param)
    })
    return params
  }

  /**
   * Update text lines normalizing text and adding styles by text line
   */
  getUpdatedTextLines() {
    let allText: any = this.text
    const textLines = this.textLines
    let updatedTextLines: any[] = []
    let textStyleGroupIndex = 0
    let startIndex = 0
    let lineIndex = 0

    textLines.forEach((textLine, index) => {
      let currentTextLine = textLine
      let isBreakLine = false
      lineIndex = index
      const prevUpdatedLine = updatedTextLines[index - 1]
      if (allText[0] === "\n") {
        allText = allText.substring(1)
        textStyleGroupIndex += 1
        if (index) {
          prevUpdatedLine.breakLine = true
        }
      } else {
        const textLineChange = index ? " " : ""
        currentTextLine = textLineChange + currentTextLine
      }

      const initialPart = allText.substring(0, currentTextLine.length)
      const remainingPart = allText.substring(currentTextLine.length)

      if (index) {
        if (prevUpdatedLine.breakLine) {
          startIndex = 0
        } else {
          startIndex = prevUpdatedLine.startIndex + prevUpdatedLine.text.length + 1
        }
      }

      allText = remainingPart
      updatedTextLines = updatedTextLines.concat({
        text: initialPart,
        breakLine: isBreakLine,
        textStyleGroupIndex,
        startIndex,
        lineIndex: lineIndex,
        initialText: textLine,
      })
    })
    const textStyleGroups = this.styles
    const updatedTextLinesWithStyles = updatedTextLines.map((updatedTextLine) => {
      const textStyleGroup = textStyleGroups[updatedTextLine.textStyleGroupIndex]
      const indexes = Array(updatedTextLine.text.length)
        .fill(0)
        .map((_, i) => (updatedTextLine.startIndex + i).toString())
      const lineStyles = pick(textStyleGroup, indexes)
      return { ...updatedTextLine, lineStyles }
    })

    return updatedTextLinesWithStyles
  }

  clearStyles() {
    this.removeStyleFromTo(0, this.text?.length!)
  }
  updateParams() {
    this.clearStyles()
    this.setParams()
    this.setParamBounds()
  }

  toObject(propertiesToInclude = []) {
    return fabric.util.object.extend(super.toObject.call(this, propertiesToInclude), {
      fontURL: this.fontURL,
      params: this.params.map((p) => ({ key: p.key, name: p.name })),
    })
  }
  toJSON(propertiesToInclude = []) {
    return fabric.util.object.extend(super.toObject.call(this, propertiesToInclude), {
      fontURL: this.fontURL,
      params: this.params.map((p) => ({ key: p.key, name: p.name })),
    })
  }

  static fromObject(options: StaticTextOptions, callback: Function) {
    return callback && callback(new fabric.StaticText(options))
  }
}

fabric.StaticText = fabric.util.createClass(StaticTextObject, {
  type: StaticTextObject.type,
})
fabric.StaticText.fromObject = StaticTextObject.fromObject

export type StaticTextOptions = fabric.ITextboxOptions & {
  text: string
  fontURL: string
  params: any
}

declare module "fabric" {
  namespace fabric {
    class StaticText extends StaticTextObject {
      constructor(options: StaticTextOptions)
    }
  }
}
