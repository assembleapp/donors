import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import {
  mdiChevronUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js"
import { Icon } from "@mdi/react"

import Board from "./board"
import { pullLeaders } from "./leaderboard"
import { session } from "./session"

const random_choose = () => (
  [
    Math.floor(Math.random() * dimensions.x),
    Math.floor(Math.random() * dimensions.y),
  ]
)

var dimensions = {x: 12, y: 12}

var snake = observable([
  [0,3],
  [0,2],
  [0,1],
  [0,0]
])

var meal = observable(random_choose())
var heading = observable.box(2)
var paused = observable.box(false)
var clockSpeed = 500
var speedReduce = 0

var pauses = observable.box(0)
var speed_drops = observable.box(0)
var add_money = observable.box(false)

const checkBalance = (price, already) => {
  var able = (session.player.balance - (already * price)) >= price
  if(!able) {
    runInAction(() => add_money.set(true))
    setTimeout(() => runInAction(() => add_money.set(false)), 1000)
  }
  return able
}

document.onkeydown = (e => {
  const heading_keys = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
  }

  if(e.code === "Space") {
    if(paused.get()) {
      runClock()
      runInAction(() => paused.set(!paused.get()))
    }
    else if(checkBalance(10, pauses.get())) {
      runInAction(() => pauses.set(pauses.get() + 1))
      clearInterval(clock)
      runInAction(() => paused.set(!paused.get()))
    }
  }

  else if(e.code === "KeyR") {
    if(speed_drops.get() > 0 || pauses.get() > 0) { endGame() }

    runInAction(() => {
      snake.replace([[0,3],[0,2],[0,1],[0,0]])
      heading.set(2)
    })
    clockSpeed = 500
    runClock()
  }

  else if (e.code === "KeyS") {
    if(checkBalance(25, speed_drops.get())) {
      speedReduce += 1
      runInAction(() => speed_drops.set(speed_drops.get() + 1))
    }
  }

  else if(Object.keys(heading_keys).indexOf(e.code) !== -1)
    runInAction(() => heading.set(heading_keys[e.code]))
})

var clock = null
const runClock = () => {
  clearInterval(clock)
  clock = setInterval(() => {
    if(speedReduce > 0) {
      while(speedReduce > 0) {
        clockSpeed = clockSpeed * 1.2
        speedReduce -= 1
      }
      runClock()
    }
    runInAction(() =>
      snake.replace([chooseNeighbor(snake[0], heading)].concat(snake.slice(0, -1)))
    )
  }, clockSpeed)
}

runClock()

const endGame = () => {
  clearInterval(clock)

  fetch('/games', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
      'Authorization': localStorage.getItem("code"),
    },
    body: JSON.stringify({ game: {
      snake: JSON.stringify(snake.toJSON()),
      score: snake.length,
      pauses: pauses.get(),
      speed_drops: speed_drops.get(),
    }})
  })
  .then(() => session.pull())
  .then(() => {
    runInAction(() => {
      pauses.set(0);
      speed_drops.set(0);
    })
  })
  .then(() => pullLeaders())
}

autorun(() => {
  if(toJS(snake).map(x => x.join(",")).lastIndexOf(toJS(snake)[0].join(",")) !== 0 )
    endGame()
})

autorun(() => {
  if(toJS(snake)[0].join(",") === meal.join(",")) {
    runInAction(() => {
      meal.replace(random_choose())
      snake.push(snake[snake.length-1])
    })
    clockSpeed = clockSpeed * 0.95
    runClock()
  }
})

const chooseNeighbor = (cell, heading) => {
  var neighbor = [
    [cell[0]    , cell[1] - 1],
    [cell[0] + 1, cell[1]    ],
    [cell[0]    , cell[1] + 1],
    [cell[0] - 1, cell[1]    ]
  ][heading]

  if(neighbor[0] < 0 || neighbor[0] >= dimensions.x)
    endGame()
  if(neighbor[1] < 0 || neighbor[1] >= dimensions.y)
    endGame()

  return neighbor
}

const cell = (place) => (
  <>
  {place.x === snake[0][0] && place.y === snake[0][1]
  ? ['^', '>', 'v', '<'][heading]
  : null
  }

  {snake.slice(1).some(p => place.x === p[0] && place.y === p[1])
  ? '+'
  : null
  }

  {place.x === meal[0] && place.y === meal[1]
  ? 'm'
  : null
  }
  </>
)

const Snake = () => (
  <Scene>
      <Header>snake -~~~~~o<Red>-&lt;</Red></Header>
      <p>
        <Icon size={1} color="#8080a0" path={mdiChevronUp} style={{marginLeft: "1.5rem"}} />
        <Command style={{ marginLeft: "2rem" }}>[r] reload</Command>
        <br/>
        <Icon size={1} color="#8080a0" path={mdiChevronLeft} />
        <Icon size={1} color="#8080a0" path={mdiChevronDown} />
        <Icon size={1} color="#8080a0" path={mdiChevronRight} />
        <Command style={{ marginLeft: "0.5rem" }}>[space] pause; $0.10</Command>
        <br/>
        <Command style={{ marginLeft: "5rem" }}>[s] reduce speed; $0.25</Command>
      </p>
      <Board
      dimensions={dimensions}
      cell={cell}
      />
      <Header>Score: {snake.length}</Header>
  </Scene>
)

const Red = styled.span`
color: red;
font-size: 0.5rem;
`

const Header = styled.header`
display: flex;
flex-direction: row;
justify-content: center;
font-size: calc(10px + 2vmin);
align-items: center;
`
const Command = styled.span`
font-family: monospace;
font-weight: 100;
vertical-align: super;
color: #8080a0;
`

const Scene = styled.div`
margin-left: auto;
margin-right: auto;
`

export { pauses, speed_drops, add_money }
export default observer(Snake);
