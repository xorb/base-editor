import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Input } from "baseui/input"

interface Props {
  params: Record<string, string>
  updateParams: (key: string, value: string) => void
  applyParams: () => void
}
const FillProps = ({ params, updateParams, applyParams }: Props) => {
  return (
    <Block $style={{ height: "100vh", width: "100vw", display: "grid", placeContent: "center" }}>
      <Block $style={{ display: "grid", gap: "1rem", width: "480px" }}>
        {Object.keys(params).map((key) => {
          return (
            <Block key={key}>
              <Block $style={{ paddingBottom: "0.5rem" }}>{key}</Block>
              <Input onChange={(e) => updateParams(key, e.target.value)} value={params[key]} />
            </Block>
          )
        })}
        <Button onClick={applyParams}>Set params</Button>
      </Block>
    </Block>
  )
}
export default FillProps
