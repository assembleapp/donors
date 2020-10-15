import React, { useRef } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { observable, autorun, toJS, runInAction } from "mobx"

import { mdiArrowRight } from "@mdi/js"
import Icon from "@mdi/react"

const SessionField = styled.input`
background: none;
border: none;
border-bottom: 2px solid black;
`

const session = observable({
    email: null,
    handle: null,
    pending: false,
    player: null,
})

const Session = () => {
    if(!session.player) {
        return (
            session.pending
            ?   <div>
                    Please check your email,<br/>
                    or
                    <a href="#"
                        onClick={() => runInAction(() => {
                            session.email = null
                            session.handle = null
                            session.pending = false
                            session.player = null
                        })}
                    >sign in again</a>.
                </div>
            :
                <Area>
                    <Query
                        type="text"
                        placeholder="player handle (public)"
                        onChange={(e) => runInAction(() => session.handle = e.target.value)}
                        value={session.handle || ""}
                    />
                    <Query
                        type="email"
                        placeholder="email (reduces scammers)"
                        onChange={(e) => runInAction(() => session.email = e.target.value)}
                        value={session.email || ""}
                    />
                    <SignIn onClick={(e) => { e.preventDefault(); signIn()}} >
                        Sign in
                    </SignIn>
                </Area>
        )
    }
    return (
        <div>
            Signed in as {session.player.handle}.
            <br/>
            <a
            href="#"
            onClick={() => {
                runInAction(() => session.replace({ email: null, handle: null, pending: false, player: null }));
                localStorage.removeItem("code")
            }}>end session.</a>
        </div>
    )
}

const signIn = () => {
    runInAction(() => session.pending = true)
    fetch("/sessions", {
        method: "POST",
        body: JSON.stringify({
            player: {
                email: session.email,
                handle: session.handle,
            },
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
        },
    })
    .then(response => response.json())
    .then(response => console.log(response))
}

const Area = styled.div`
padding: 1rem;
display: flex;
flex-direction: column;
width: 12rem;
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

const SignIn = styled.button`
width: 100%;
padding: 0.5rem;
background-color: rgba(196, 196, 212, 0.6);
border-radius: 4px;
outline: none;
border: none;
`

export default observer(Session)