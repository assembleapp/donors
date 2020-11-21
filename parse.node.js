var fs = require('fs')
var acorn = require('acorn')
var acornJSX = require('acorn-jsx')
var astring = require('astring')

fs.readFile('app/javascript/packs/splash.js', 'utf8', (error, response) => {
    if(error) return console.log(error)
    var program = response
    
    var Parser = acorn.Parser.extend(acornJSX())
    var parsed = Parser.parse(program, { sourceType: 'module' })
    // fs.writeFile('program.json', JSON.stringify(parsed, null, 2), err => console.log(err))
    
    var jsxGenerator = Object.assign({}, astring.baseGenerator, {
        JSXElement: function(node, state) {
            this[node.openingElement.type](node.openingElement, state)
            if(node.children)
              node.children.forEach(child => this[child.type](child, state) )
            if(node.closingElement)
                this[node.closingElement.type](node.closingElement, state)
        },
        JSXOpeningElement: function(node, state) {
            state.write("<")
            this[node.name.type](node.name, state)
            if(node.attributes)
              node.attributes.forEach(attr => this[attr.type](attr, state))
            state.write(
                node.selfClosing
                ? "/>"
                : ">"
            )
        },
        JSXClosingElement: function(node, state) {
            state.write("</")
            this[node.name.type](node.name, state)
            state.write(">")
        },
        JSXText: function(node, state) {
            state.write(node.raw)
        },
        JSXIdentifier: function(node, state) {
            state.write(node.name)
        },
        JSXAttribute: function(node, state) {
            state.write(" ")
            this[node.name.type](node.name, state)
            state.write("=")
            this[node.value.type](node.value, state)
        },
        JSXExpressionContainer: function(node, state) {
            state.write("{")
            this[node.expression.type](node.expression, state)
            state.write("}")
        },
    })

    var remade = astring.generate(parsed, { generator: jsxGenerator })
    fs.writeFile('program.js', remade, err => console.log(err))
})
