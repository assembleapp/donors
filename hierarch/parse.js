var fs = require('fs')
var acorn = require('acorn')
var acornJSX = require('acorn-jsx')
var astring = require('astring')
const prettier = require('prettier')

const go = (change = null) => {
    var sourceAddress = __dirname + '/../app/javascript/packs/charge.js'
    var source_name = sourceAddress.split("../").slice(-1)[0]

    fs.readFile(sourceAddress, 'utf8', (error, response) => {
        if(error) return console.log(error)
        var program = response
        
        var Parser = acorn.Parser.extend(acornJSX())
        var parsed = Parser.parse(program, { sourceType: 'module', locations: true, preserveParens: true })
        // fs.writeFile('program.json', JSON.stringify(parsed, null, 2), err => console.log(err))
        
        var jsxGenerator = {
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
                        "specifiers": [{
                            "type": "ImportDefaultSpecifier",
                            "local": {
                                "type": "Identifier",
                                "name": "Lens"
                            }
                        }],
                        "source": {
                            "type": "Literal",
                            "value": "./assemble/lens",
                            "raw": "'./assemble/lens'"
                        }
                    }].concat(node.body)
                astring.baseGenerator.Program.bind(this)(node, state)
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
                    node.openingElement.name.name = "Lens.change"
                    node.openingElement.attributes = node.openingElement.attributes.concat({
                        type: "JSXAttribute",
                        name: { type: "JSXIdentifier", name: "source" },
                        value: {
                            type: "Literal",
                            value: source_name,
                            raw: `'${source_name}'`,
                        },
                    })
                    node.openingElement.attributes = node.openingElement.attributes.concat({
                        type: "JSXAttribute",
                        name: { type: "JSXIdentifier", name: "code" },
                        value: {
                            type: "Literal",
                            value: "abcd",
                            raw: `'${"abcd"}'`,
                        },
                    })
                    node.closingElement.name.name = "Lens.change"
                }

                if(node.openingElement.name.type === "JSXMemberExpression" &&
                    node.openingElement.name.object.name === "Lens" &&
                    node.openingElement.name.property.name === "change"
                ) {
                    if(change &&
                        change.code
                        && change.source === source_name &&
                        change.upgrade
                    ) {
                        if(node.openingElement.attributes.some(a =>
                            a.name.name === 'source' &&
                            a.value.value === source_name
                        )) {
                            if(node.openingElement.attributes.some(a =>
                                a.name.name === "code" &&
                                a.value.value === change.code
                            )) {
                                node.children[0].value = change.upgrade
                                node.children[0].raw = change.upgrade

                                node.openingElement.name.type = 'JSXIdentifier'
                                node.openingElement.name.name = 'ChargeCard'
                                node.closingElement.name.type = 'JSXIdentifier'
                                node.closingElement.name.name = 'ChargeCard'

                                node.openingElement.attributes = node.openingElement.attributes.filter(a => !(
                                    a.name.name === "source" &&
                                    a.value.value === source_name
                                ))
                                node.openingElement.attributes = node.openingElement.attributes.filter(a => !(
                                    a.name.name === "code" &&
                                    a.value.value === change.code
                                ))
                            }
                        }
                    }
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

        addBaseGeneratorFunctions(jsxGenerator, [
            "ArrayExpression",
            "ArrowFunctionExpression",
            "AssignmentExpression",
            "BinaryExpression",
            "BlockStatement",
            "CallExpression",
            "ConditionalExpression",
            "ExportDefaultDeclaration",
            "ExpressionStatement",
            "ExportNamedDeclaration",
            "IfStatement",
            "Identifier",
            "ImportDeclaration",
            "ImportDefaultSpecifier",
            "ImportSpecifier",
            "Literal",
            "LogicalExpression",
            "MemberExpression",
            "Property",
            "SpreadElement",
            "TaggedTemplateExpression",
            "TemplateElement",
            "TemplateLiteral",
            "VariableDeclaration",
            "VariableDeclarator",
            "formatSequence",
            "ObjectPattern",
        ])

        var remade = prettier.format(
            astring.generate(parsed, { generator: jsxGenerator }),
            { semi: false, parser: "babel" },
        )

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

var addBaseGeneratorFunctions = (generator, functions) => {
    functions.forEach(name => {
        generator[name] = function(node, state) {
            add_lines(state, node.loc)
            astring.baseGenerator[name].bind(generator)(node, state)
        }
    })
}

module.exports = go