import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import { CellPanel } from "./board"
import Snake from "./snake"

const Splash = () => (
<Scene>
    <Column>
    </Column>
    <Column>
        <Snake/>
    </Column>
    <Column>
        <CellPanel />
    </Column>
</Scene>
)

const Column = styled.div`
display: flex;
flex-direction: column;
`

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: 30% auto 20%;
grid-gap: none;
color: #ededed;
`

export default observer(Splash)