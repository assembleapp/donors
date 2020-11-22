import React from "react"
import styled from "styled-components"

// const li = styled.li`
// border: 1px solid #ee4a0a;
// `

const li = ({children}) => (
    <input
    key={children}
    style={{ display: "block" }}
    type="text"
    value={children}
    onChange={(e) => console.log(e.target.value)}
    />
)

const Lens = { li }

export default Lens