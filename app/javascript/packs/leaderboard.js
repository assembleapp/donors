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
        <Leader key={l.handle}>
          <Score>{l.score}</Score>
          by {l.handle}<br/>
          {l.ended} using {l.pauses} pauses
        </Leader>
      ))}
  </Scene>
)

pullLeaders()

const Leader = styled.div`
padding: 1rem;
border: 1px solid #8484d8;
border-radius: 4px;
margin-bottom: 0.5rem;
display: flex;
align-items: flex-begin;
`

const Handle = styled.span`
`

const Score = styled.span`
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
margin-left: auto;
margin-right: auto;
`

export default observer(LeaderBoard);
