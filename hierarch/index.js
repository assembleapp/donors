const express = require('express')
const responder = express.Router()


responder.get("/sources", (request, response) => {
    response.send("/app/javascript/packs/splash.js")
})

module.exports = responder