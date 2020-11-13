import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import {
    mdiCreditCardOutline,
    mdiChevronUp,
} from "@mdi/js"
import { Icon } from "@mdi/react"

import SquareCardArea from "./square"
import { CellPanel } from "./board"
import Snake from "./snake"
import LeaderBoard from "./leaderboard"
import Session, { session } from "./session"
import { pauses, speed_drops } from "./snake"

autorun(() => console.log(pauses.get(), "pauses"))

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
            <Balance>your balance: ${session.player ? (
                (session.player.balance - (pauses.get() * 10) - (speed_drops.get() * 25))
            / 100.0).toFixed(2) : 0.00}</Balance>
        </Line>

        <SquareCardArea session={session} />
        <ChargeArea session={session} />
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

const ChargeArea = observer(({ session }) => (
    session.player && session.player.card_summary
    ?
        <Area>
            <Query type="text" placeholder="add money (in USD)" value={price.get()}
            onChange={(e) => runInAction(() => price.set(e.target.value))} />
        
            <ChargeCard onClick={(e) => {e.preventDefault(); chargeCard()}} >
            Charge card
            </ChargeCard>
        </Area>
    :
        <Area>
            <Icon size={1} path={mdiChevronUp} />
            {session.player ? "Add" : "Sign in and add"} a bank card.
        </Area>
))

const price = observable.box("5.00")

const chargeCard = () => {
    fetch("/card/charge", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
            'Authorization': localStorage.getItem("code"),
        },
        body: JSON.stringify({
            charge: { price: price.get() },
        }),
    }).then(() => window.location = window.location)
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