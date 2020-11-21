var fs = require('fs')
var {Parser} = require('acorn')

var program = ''
fs.readFile('app/javascript/packs/splash.js', 'utf8', (error, response) => {
    if(error) return console.log(error)
    program = response
})

var Parse = Parser.extend(require('acorn-jsx')())
fs.writeFile('program.json', JSON.stringify(Parse.parse(program, { sourceType: 'module' }), null, 2), err => console.log(err))