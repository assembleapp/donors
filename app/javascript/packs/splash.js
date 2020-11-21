import React from 'react';
import styled from "styled-components";
import {observer} from "mobx-react";

import {mdiCreditCardOutline} from "@mdi/js";
import {Icon} from "@mdi/react";

import SquareCardArea from "./square";
import ChargeArea from "./charge";
import {CellPanel} from "./board";
import Snake from "./snake";
import LeaderBoard from "./leaderboard";
import Session, {session} from "./session";
import {pauses, speed_drops, add_money} from "./snake";

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
              (session.player.balance - (pauses.get() * 10) - (speed_drops.get() * 25)) /
            100.0).toFixed(2) : 0.00}</Balance>
        </Line>

        <SquareCardArea session={session} />
        <ChargeArea session={session} />

        {add_money.get() ?
        <AddMoney>Add money!</AddMoney> :
        null}
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
        <CellPanel/>
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
        <pre>
            See our&nbsp;
            <a style={{color: "#8080a0"}} href="https://github.com/assembleapp/snake/issues/1" >
                proposed game code
            </a>.
        </pre>
    </PaddedColumn>
</Scene>);


const Code = styled.code`
display: inline;
color: #8c8cd0;
`;

const AddMoney = styled.div`
color: #8080a0;
border: 4px solid #a08080;
font-family: monospace;
padding: 1rem;
`;

const Appeal = styled.div`
font-family: sans-serif;
margin-bottom: 0.5rem;
`;

const Balance = styled.span`
font-family: sans-serif;
`;

const Line = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 1rem;
`;

const Column = styled.div`
display: flex;
flex-direction: column;
padding-top: 1rem;
`;

const PaddedColumn = styled(Column)`
padding: 1rem;
`;

const Scene = styled.div`
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: auto 1fr 2fr auto;
grid-gap: none;
color: #ededed;
`;

export default observer(Splash);
