const express = require('express')
const responder = express.Router()

const go = require("./parse")

responder.get("/sources", (call, response) => {
    response.send("/app/javascript/packs/splash.js")
})

responder.get("/go", (call, response) => {
    go()
    response.send("gone.")
})

module.exports = responder