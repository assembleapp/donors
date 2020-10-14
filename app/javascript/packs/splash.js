import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import {
    mdiCreditCardOutline,
} from "@mdi/js"
import { Icon } from "@mdi/react"

import SquareCardArea from "./square"
import { CellPanel } from "./board"
import Snake from "./snake"

const Splash = () => (
<Scene>
    <PaddedColumn>
        <Appeal>
            help us expand<br/>
            beyond our humble beginnings.
        </Appeal>

        <HandleArea/>

        <Icon size={2} path={mdiCreditCardOutline} color="#2d7386" />

        <SquareCardArea/>
        <ChargeArea/>
    </PaddedColumn>
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
        <SignIn onClick={(e) => { e.preventDefault(); signIn()}} >
            Sign in
        </SignIn>
    </Area>
)

const ChargeArea = () => (
    <Area>
        <Query type="text" placeholder="lump sum or daily sum" />
        <Query type="text" placeholder="discord access" />
        <Query type="text" placeholder="charge price" />

        <ChargeCard onClick={(e) => {e.preventDefault(); chargeCard()}} >
            Charge card
        </ChargeCard>
    </Area>
)

const signIn = () => {
}

const chargeCard = () => {
}

const Appeal = styled.div`
font-family: sans-serif;
margin-bottom: 0.5rem;
`

const Query = styled.input`
font-size: 16px;
line-height: 24px;
&::placeholder {
    color: #a0a0a0;
}
color: #e0e0e0;
background-color: rgba(212, 196, 196, 0.2);
border: none;
margin-bottom: 0.2rem;
outline: none;
`

const Column = styled.div`
display: flex;
flex-direction: column;
`

const PaddedColumn = styled(Column)`
padding: 1rem;
`

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: none;
color: #ededed;
`

const Area = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
width: 12rem;
`

const ChargeCard = styled.button`
width: 100%;
padding: 0.5rem;
background-color: rgba(196, 196, 212, 0.6);
border-radius: 4px;
outline: none;
border: none;
`

const SignIn = styled.button`
width: 100%;
padding: 0.5rem;
background-color: rgba(196, 196, 212, 0.6);
border-radius: 4px;
outline: none;
border: none;
`

export default observer(Splash)