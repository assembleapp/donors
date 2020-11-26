import React from "react"
import styled from "styled-components"

// const pre = styled.pre`
// border: 1px solid #ee4a0a;
// `

const pre = ({children}) => (
    <textarea
    key={children}
    style={{ display: "block" }}
    type="text"
    value={children}
    onChange={(e) => console.log(e.target.value)}
    />
)

const Lens = { pre }

export default Lens