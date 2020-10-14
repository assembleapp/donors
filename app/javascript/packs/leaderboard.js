import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

// import {
// } from "@mdi/js"
import { Icon } from "@mdi/react"

const LeaderBoard = () => (
  <Scene>
      <Header>leaderboard</Header>
  </Scene>
)

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
