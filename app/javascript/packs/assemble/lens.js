import React from "react"
import styled from "styled-components"

const change = ({children, source, code}) => (
    <textarea
    key={children}
    style={{ display: "block" }}
    type="text"
    value={children}
    onChange={(e) => fetch("http://0.0.0.0:4321/change", {
        method: "POST",
        body: JSON.stringify({
            upgrade: e.target.value,
            source,
            code,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.text())
    .then(response => console.log(response))}
    />
)

const Lens = { change }

export default Lens