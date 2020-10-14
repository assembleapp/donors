import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable, runInAction, computed } from "mobx"
import { ChromePicker } from "react-color"

const Board = observer(({ dimensions, cell, subscenes }) => (
    <Scene dimensions={dimensions}>
        {[...Array(dimensions.x * dimensions.y).keys()].map(n => ({
            x: (n % dimensions.x),
            y: Math.floor(n / dimensions.x),
        })).map(place =>
            <subscenes.cell key={Object.values(place).join(',')}>
                {cell(place)}
            </subscenes.cell>
        )}
    </Scene>
))

const Scene = styled.div`
display: grid;
grid-template-columns: repeat(${({dimensions}) => dimensions.x}, 1.5rem);
grid-template-rows: repeat(${({dimensions}) => dimensions.y}, 1.5rem);
grid-gap: 0.1rem;
margin-left: auto;
margin-right: auto;
`

const cellBorder = observable({
    size: 1,
    measure: "px",
    brush: "solid",
    color: "#4d4d4d",
})
const Cell = computed(() => styled.div`
border: ${String(cellBorder.size) + cellBorder.measure} ${cellBorder.brush} ${cellBorder.color};
text-align: center;
`)

const CellPanel = observer(() => (
    <form>
        <Heading>change cell border</Heading>
        <Line>
            <SmallNumber
            onChange={(e) => runInAction(() => cellBorder.size = e.target.value)}
            value={cellBorder.size}
            />
            <input type="radio" name="measure" onChange={(e)=> runInAction(() => cellBorder.measure = e.target.value)} value="px" checked={cellBorder.measure === "px"} />pixel
            <input type="radio" name="measure" onChange={(e)=> runInAction(() => cellBorder.measure = e.target.value)} value="rem" checked={cellBorder.measure === "rem"} />rem
        </Line>

        <Line>
            <input type="radio" name="brush" onChange={(e)=> runInAction(() => cellBorder.brush = e.target.value)} value="solid" checked={cellBorder.brush === "solid"} />solid
            <input type="radio" name="brush" onChange={(e)=> runInAction(() => cellBorder.brush = e.target.value)} value="dashed" checked={cellBorder.brush === "dashed"} />dashed
            <input type="radio" name="brush" onChange={(e)=> runInAction(() => cellBorder.brush = e.target.value)} value="dotted" checked={cellBorder.brush === "dotted"} />pixels
        </Line>

        <ChromePicker
          color={cellBorder.color}
          onChangeComplete={(color) => runInAction(() => cellBorder.color = color.hex)}
        />
    </form>
))

const Heading = styled.h3`
font-family: sans-serif;
`
const Line = styled.div``
const SmallNumber = styled.input.attrs({
    type: "number",
})`
width: 3rem;
`

export { CellPanel }
export default observer(basis => <Board {...basis} subscenes={{ cell: Cell.get() }} /> );
