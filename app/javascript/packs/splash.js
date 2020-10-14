import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import SquareCardArea from "./square"
import { CellPanel } from "./board"
import Snake from "./snake"

const Splash = () => (
<Scene>
    <Column>
        <HandleArea/>
        <SquareCardArea/>
        <ChargeArea/>
    </Column>
    <Column>
        <Snake/>
    </Column>
    <Column>
        <CellPanel />
    </Column>
</Scene>
)

const HandleArea = () => (
    <Area>
        <Query type="text" placeholder="player handle" />
        <Query type="text" placeholder="email address" />
    </Area>
)

const ChargeArea = () => (
    <Area>
        <Query type="text" placeholder="lump sum or daily sum" />
        <Query type="text" placeholder="discord access" />
        <Query type="text" placeholder="charge price" />
    </Area>
)


const Query = styled.input`
font-size: 16px;
line-height: 24px;
placeholder-color: #a0a0a0;
color: #e0e0e0;
background-color: rgba(212, 196, 196, 0.2);
border: none;
margin-bottom: 0.2rem;
`

const Column = styled.div`
display: flex;
flex-direction: column;
`

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: auto 1fr auto;
grid-gap: none;
color: #ededed;
`

const Area = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
`

export default observer(Splash)