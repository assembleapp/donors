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
import LeaderBoard from "./leaderboard"
import Session from "./session"

const Splash = () => (
<Scene>
    <PaddedColumn>
        <Appeal>
            please help us expand<br/>
            beyond our humble beginnings.
        </Appeal>

        <Session/>

        <Line>
            <Icon size={2} path={mdiCreditCardOutline} color="#2d7386" />
            <Balance>your balance: $0</Balance>
        </Line>

        <SquareCardArea/>
        <ChargeArea/>
    </PaddedColumn>

    <Column>
        <LeaderBoard/>
    </Column>

    <Column>
        <Snake/>
    </Column>

    <PaddedColumn>
        <pre>
        programmed using an engine<br/>
        named <Code>hierarch</Code>,<br/>
        enabling in-game code changes.
        </pre>
        <CellPanel />
        <pre>
        should our business succeed,<br/>
        <Code>hierarch</Code> shall be released<br/>
        as an open-source codebase.<br/>
        our design plan includes:<br/>
            <ul>
                <li>scene graph</li>
                <li>decision graph</li>
                <li>grid algebra</li>
                <li>logic blocks</li>
                <li>procedures</li>
                <li>channels</li>
                <li>shapes</li>
                <li>display renderers</li>
                <li>memory addressing</li>
                <li>roles and permissions</li>
                <li>image processing</li>
                <li>audio processing</li>
                <li>clock loops</li>
            </ul>
        </pre>
    </PaddedColumn>
</Scene>
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

const Code = styled.code`
display: inline;
color: #8c8cd0;
`

const Appeal = styled.div`
font-family: sans-serif;
margin-bottom: 0.5rem;
`

const Balance = styled.span`
font-family: sans-serif;
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

const Line = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 1rem;
`

const Column = styled.div`
display: flex;
flex-direction: column;
padding-top: 1rem;
`

const PaddedColumn = styled(Column)`
padding: 1rem;
`

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: auto 1fr 2fr auto;
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

export default observer(Splash)