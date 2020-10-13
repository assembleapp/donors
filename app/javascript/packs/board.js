import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable, runInAction, computed } from "mobx"

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
grid-template-columns: repeat(${({dimensions}) => dimensions.x}, 2rem);
grid-template-rows: repeat(${({dimensions}) => dimensions.y}, 2rem);
grid-gap: 0.1rem;
margin-left: auto;
margin-right: auto;
`

const cellBorder = observable.box("1px solid #4d4d4d")
const Cell = computed(() => styled.div`
border: ${cellBorder.get()};
`)

const CellPanel = observer(() => (
    <input
    type="text"
    onChange={(e) => runInAction(() => cellBorder.set(e.target.value))}
    value={cellBorder.get()}
    />
))

export { CellPanel }
export default observer(basis => <Board {...basis} subscenes={{ cell: Cell.get() }} /> );
