import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

// import {
// } from "@mdi/js"
import { Icon } from "@mdi/react"

const leaders = observable([])
window.leaders = leaders

const pullLeaders = () => fetch("/games", {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
  }})
  .then(response => response.json())
  .then(response => runInAction(() => leaders.replace(response.leaderboard)))

const LeaderBoard = () => (
  <Scene>
      <Header>leaderboard</Header>
      {leaders.map(l => (
        <Leader key={l.handle + "," + l.ended}>
          <Score>{l.score}</Score>
          <span>
          <Handle>{l.handle}</Handle><br/>
          using {l.pauses} pauses and {l.speed_drops} speed drops<br/>
          {l.ended.split("T").join("\t").replace("Z", " (PMZ)")}
          </span>
        </Leader>
      ))}
      <Explainer>PMZ = 'Prime Meridian Zone'; or roughly, England.</Explainer>
  </Scene>
)

pullLeaders()

const Leader = styled.div`
padding: 0.5rem;
width: 100%;
margin-top: 1rem;
border: 2px solid #8080a0;
border-radius: 4px;
display: flex;
align-items: flex-begin;
font-family: sans-serif;
color: #8080a0;
background-color: rgba(192,192,216,0.2);
font-size: 0.8rem;
`

const Explainer = styled.div`
margin-top: 1rem;
color: #8080a0;
`

const Handle = styled.span`
color: #8080d0;
font-size: 1rem;
font-family: monospace;
`

const Score = styled.span`
color: #d475a5;
font-size: 3rem;
margin-right: 0.5rem;
`

const Ended = styled.span`
`

const Pauses = styled.span`
`

const Header = styled.header`
display: flex;
flex-direction: row;
justify-content: center;
font-size: calc(10px + 2vmin);
align-items: center;
`

const Scene = styled.div`
`

export { pullLeaders }
export default observer(LeaderBoard);
