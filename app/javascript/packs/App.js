import React from 'react';
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"
import { observer } from "mobx-react"

import Board, { CellPanel } from "./board"

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
var clockSpeed = 500

document.onkeydown = (e => {
  const recognized_keys = {
    ArrowUp: 0,
    ArrowRight: 1,
    ArrowDown: 2,
    ArrowLeft: 3,
  }

  if(Object.keys(recognized_keys).indexOf(e.code) !== -1)
    heading.set(recognized_keys[e.code])
})

var clock = null
const runClock = () => {
  clearInterval(clock)
  clock = setInterval(() => runInAction(() =>
    snake.replace([chooseNeighbor(snake[0], heading)].concat(snake.slice(0, -1)))
  ), clockSpeed)
}

runClock()

const endGame = () => {
  clearInterval(clock)
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

function App() {
  return (
    <Application>
      <Column></Column>
      <Column>
        <AppHeader>Snake Game</AppHeader>
        <Board
        dimensions={dimensions}
        cell={cell}
        />
        <AppHeader>Score: {snake.length}</AppHeader>
      </Column>
      <Column>
        <CellPanel />
      </Column>
    </Application>
  );
}

const AppHeader = styled.header`
display: flex;
flex-direction: row;
justify-content: center;
font-size: calc(10px + 2vmin);
align-items: center;
`

const Column = styled.div`
display: flex;
flex-direction: column;
overflow-y: scroll;
`

const Application = styled.div`
text-align: center;
background-color: #282c34;
min-height: 100vh;
display: grid;
grid-template-columns: 30% auto 20%;
color: #ededed;
`

export default observer(App);
