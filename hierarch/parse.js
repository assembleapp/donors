var fs = require('fs')
var acorn = require('acorn')
var acornJSX = require('acorn-jsx')
var astring = require('astring')

const go = () => {
    var sourceAddress = __dirname + '/../app/javascript/packs/charge.js'
    fs.readFile(sourceAddress, 'utf8', (error, response) => {
        if(error) return console.log(error)
        var program = response
        
        var Parser = acorn.Parser.extend(acornJSX())
        var parsed = Parser.parse(program, { sourceType: 'module', locations: true, preserveParens: true })
        // fs.writeFile('program.json', JSON.stringify(parsed, null, 2), err => console.log(err))
        
        var jsxGenerator = {
            ArrayExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ArrayExpression.bind(this)(node, state)
            },
            ArrowFunctionExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ArrowFunctionExpression.bind(this)(node, state)
            },
            AssignmentExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.AssignmentExpression.bind(this)(node, state)
            },
            BinaryExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.BinaryExpression.bind(this)(node, state)
            },
            BlockStatement: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.BlockStatement.bind(this)(node, state)
            },
            CallExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.CallExpression.bind(this)(node, state)
            },
            ConditionalExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ConditionalExpression.bind(this)(node, state)
            },
            ExportDefaultDeclaration: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ExportDefaultDeclaration.bind(this)(node, state)
            },
            ExpressionStatement: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ExpressionStatement.bind(this)(node, state)
            },
            ExportNamedDeclaration: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ExportNamedDeclaration.bind(this)(node, state)
            },
            IfStatement: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.IfStatement.bind(this)(node, state)
            },
            Identifier: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.Identifier.bind(this)(node, state)
            },
            ImportDeclaration: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ImportDeclaration.bind(this)(node, state)
            },
            ImportDefaultSpecifier: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ImportDefaultSpecifier.bind(this)(node, state)
            },
            ImportSpecifier: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ImportSpecifier.bind(this)(node, state)
            },
            Literal: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.Literal.bind(this)(node, state)
            },
            LogicalExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.LogicalExpression.bind(this)(node, state)
            },
            MemberExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.MemberExpression.bind(this)(node, state)
            },
            ObjectExpression: function(node, state) {
                add_lines(state, node.loc)
                // astring.baseGenerator.ObjectExpression.bind(this)(node, state)
                state.write("{")
                node.properties.forEach(prop => {
                    this[prop.type](prop, state)
                    state.write(",")
                })
                state.write("}")
            },
            Program: function(node, state) {
                add_lines(state, node.loc)
                if(node.body[0].source.value !== "./assemble/lens")
                    node.body = [{
                        "type": "ImportDeclaration",
                        "start": 0,
                        "end": 26,
                        "specifiers": [
                        {
                            "type": "ImportDefaultSpecifier",
                            "start": 7,
                            "end": 12,
                            "local": {
                            "type": "Identifier",
                            "start": 7,
                            "end": 12,
                            "name": "Lens"
                            }
                        }
                        ],
                        "source": {
                        "type": "Literal",
                        "start": 18,
                        "end": 25,
                        "value": "./assemble/lens",
                        "raw": "'./assemble/lens'"
                        }
                    }].concat(node.body)
                astring.baseGenerator.Program.bind(this)(node, state)
            },
            Property: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.Property.bind(this)(node, state)
            },
            SpreadElement: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.SpreadElement.bind(this)(node, state)
            },
            TaggedTemplateExpression: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.TaggedTemplateExpression.bind(this)(node, state)
            },
            TemplateElement: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.TemplateElement.bind(this)(node, state)
            },
            TemplateLiteral: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.TemplateLiteral.bind(this)(node, state)
            },
            VariableDeclaration: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.VariableDeclaration.bind(this)(node, state)
            },
            VariableDeclarator: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.VariableDeclarator.bind(this)(node, state)
            },
            formatSequence: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.formatSequence.bind(this)(node, state)
            },
            ObjectPattern: function(node, state) {
                add_lines(state, node.loc)
                astring.baseGenerator.ObjectPattern.bind(this)(node, state)
            },

            ParenthesizedExpression: function(node, state) {
                add_lines(state, node.loc)
                state.write("(")
                this[node.expression.type](node.expression, state)
                state.write(")")
            },
            JSXElement: function(node, state) {
                add_lines(state, node.loc)

                if(node.openingElement.name.name === "ChargeCard") {
                    node.openingElement.name.name = "Lens.pre"
                    node.closingElement.name.name = "Lens.pre"
                }

                this[node.openingElement.type](node.openingElement, state)
                if(node.children)
                    node.children.forEach(child => this[child.type](child, state) )
                if(node.closingElement)
                    this[node.closingElement.type](node.closingElement, state)
            },
            JSXOpeningElement: function(node, state) {
                add_lines(state, node.loc)
                state.write("<")
                this[node.name.type](node.name, state)
                if(node.attributes && node.attributes.length > 0) {
                    node.attributes.forEach(attr => this[attr.type](attr, state))
                    state.write(" ")
                }
                state.write(
                    node.selfClosing
                    ? "/>"
                    : ">"
                )
            },
            JSXFragment: function(node, state) {
                this[node.openingFragment.type](node.openingFragment, state)
                node.children.forEach(child => this[child.type](child, state))
                this[node.closingFragment.type](node.closingFragment, state)
            },
            JSXOpeningFragment: function(node, state) {
                state.write("<>")
            },
            JSXClosingFragment: function(node, state) {
                state.write("</>")
            },
            JSXMemberExpression: function(node, state) {
                this[node.object.type](node.object, state)
                state.write(".")
                this[node.property.type](node.property, state)
            },
            JSXClosingElement: function(node, state) {
                add_lines(state, node.loc)
                state.write("</")
                this[node.name.type](node.name, state)
                state.write(">")
            },
            JSXText: function(node, state) {
                add_lines(state, node.loc)
                state.write(node.raw)
            },
            JSXIdentifier: function(node, state) {
                add_lines(state, node.loc)
                state.write(node.name)
            },
            JSXAttribute: function(node, state) {
                state.write(" ")
                add_lines(state, node.loc)
                this[node.name.type](node.name, state)
                state.write("=")
                this[node.value.type](node.value, state)
            },
            JSXExpressionContainer: function(node, state) {
                add_lines(state, node.loc)
                state.write("{")
                this[node.expression.type](node.expression, state)
                state.write("}")
            },
            JSXSpreadAttribute: function(node, state) {
                add_lines(state, node.loc)
                state.write("{...")
                this[node.argument.type](node.argument, state)
                state.write("}")
            },
        }

        var remade = astring.generate(parsed, { generator: jsxGenerator })
        fs.writeFile(sourceAddress, remade, err => console.log(err))
    })
}

var add_lines = (state, loc) => {
    if(!loc) return null
    while(state.output.split("\n").length < loc.start.line)
        state.write("\n")

    if(state.output.split("\n").length == loc.start.line) {
        lines = () => state.output.split("\n")
        while(lines()[lines().length-1].length + 1 <= loc.start.column) {
            state.write(" ")
        }
    }
}

module.exports = go