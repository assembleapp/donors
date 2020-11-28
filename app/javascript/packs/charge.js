import Lens from "./assemble/lens"
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable, runInAction } from "mobx"
import { Icon } from "@mdi/react"
import { mdiChevronUp } from "@mdi/js"

const ChargeArea = observer(({ session }) =>
  session.player && session.player.card_summary ? (
    <Area>
      <Query
        type="text"
        placeholder="add money (in USD)"
        value={price.get()}
        onChange={(e) => runInAction(() => price.set(e.target.value))}
      />

      <ChargeCard
        onClick={(e) => {
          e.preventDefault()
          chargeCard()
        }}
      >
        Charge your card.
      </ChargeCard>
    </Area>
  ) : (
    <Area>
      <Icon size={1} path={mdiChevronUp} />
      {session.player ? "Add" : "Sign in and add"} a bank card.
    </Area>
  )
)

const price = observable.box("5.00")

const chargeCard = () => {
  fetch("/card/charge", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
      Authorization: localStorage.getItem("code"),
    },

    body: JSON.stringify({
      charge: { price: price.get() },
    }),
  }).then(() => (window.location = window.location))
}

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

export default ChargeArea
