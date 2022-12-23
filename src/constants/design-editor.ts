import { nanoid } from "nanoid"
import { IFrame, IScene } from "@layerhub-pro/types"

export const defaultTemplate: IScene = {
  id: nanoid(),
  frame: {
    width: 1200,
    height: 1200,
  },
  layers: [
    {
      id: "background",
      name: "Initial Frame",
      left: 0,
      top: 0,
      width: 1200,
      height: 1200,
      type: "Background",
      fill: "#ffffff",
      metadata: {},
    },
  ],
  metadata: {},
}

export const samplePersonalization: IScene = {
  id: nanoid(),
  frame: {
    width: 1200,
    height: 1200,
  },
  layers: [
    {
      id: "background",
      name: "Initial Frame",
      left: 0,
      top: 0,
      width: 1200,
      height: 1200,
      type: "Background",
      metadata: {},
    },
    {
      id: "PrintItem",
      name: "Initial PrintItem",
      type: "PrintItem",
      src: "https://i.ibb.co/C9ht05r/tshitpng.png",
      top: -1000,
      left: -1000,
      scaleX: 2,
      scaleY: 2,
      metadata: {},
    },
  ],
  metadata: {},
}

export const getDefaultTemplate = ({ width, height }: IFrame) => {
  return {
    id: nanoid(),
    frame: {
      width,
      height,
    },
    layers: [
      {
        id: "background",
        name: "Initial Frame",
        left: 0,
        top: 0,
        width,
        height,
        type: "Background",
        fill: "#ffffff",
        metadata: {},
      },
    ],
    metadata: {},
  }
}

export const TEXT_EFFECTS = [
  {
    id: 1,
    name: "None",
    preview: "https://i.ibb.co/Wyx2Ftf/none.webp",
  },
  {
    id: 2,
    name: "Shadow",
    preview: "https://i.ibb.co/HBQc95J/shadow.webp",
  },
  {
    id: 3,
    name: "Lift",
    preview: "https://i.ibb.co/M7zpk5f/lift.webp",
  },
  {
    id: 4,
    name: "Hollow",
    preview: "https://i.ibb.co/vhjCd4w/hollow.webp",
  },
  {
    id: 5,
    name: "Splice",
    preview: "https://i.ibb.co/B2JPTfq/splice.webp",
  },
  {
    id: 6,
    name: "Neon",
    preview: "https://i.ibb.co/fHdD2mx/neon.webp",
  },
]
