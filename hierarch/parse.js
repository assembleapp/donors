var fs = require('fs')

const Parser = require("tree-sitter")
const JavaScript = require("tree-sitter-javascript")
const parser = new Parser()
parser.setLanguage(JavaScript)

const go = (change = null) => {
    var sourceAddress = __dirname + '/../app/javascript/packs/charge.js'
    var source_name = sourceAddress.split("../").slice(-1)[0]

    fs.readFile(sourceAddress, 'utf8', (error, response) => {
        if(error) return console.log(error)
        var program = response

        const replace_in_program_by_node = (program, node, upgrade) =>
            replace_in_program_by_indices(program, node.startIndex, node.endIndex, upgrade)

        const replace_in_program_by_indices = (program, begin, end, upgrade) => {
            if(begin < 0) {
                begin = str.length + begin
                if(begin < 0) begin = 0
            }

            return program.slice(0, begin) + (upgrade || "") + program.slice(end)
        }

        // search for, and perhaps insert, necessary import statement
        var parsed = parser.parse(program)
        var query = new Parser.Query(JavaScript, `(import_statement (import_clause (identifier) @identifier) source: (string) @source)`);
        var matches = query.matches(parsed.rootNode).map(x => x.captures.map(c => parsed.getText(c.node)))
        if(!matches.some(dependency => dependency[0] === "Lens" && dependency[1].match(/^['"]\.\/assemble\/lens['"]$/))) {
            program = replace_in_program_by_indices(program, 0, 0, "import Lens from './assemble/lens'\n")
        }

        // single out an element to change
        parsed = parser.parse(program)
        query = new Parser.Query(JavaScript, `(jsx_element
            open_tag: (jsx_opening_element name: (identifier) @opening-name)
            close_tag: (jsx_closing_element name: (identifier) @closing-name)
            )`);
        matches = query.matches(parsed.rootNode).filter(x =>
            x.captures.every(c => parsed.getText(c.node) === "ChargeCard")
        )
        matches.forEach(match => {
            program = replace_in_program_by_node(program, match.captures.filter(c => c.name === "closing-name")[0].node, "Lens.change")

            // here:
            // add opening element attributes:
            // source={source_name}
            // code="abcd"

            program = replace_in_program_by_node(program, match.captures.filter(c => c.name === "opening-name")[0].node, "Lens.change")
        })

        // restore changed element
        if(change &&
            // change.code &&
            // change.source === source_name &&
            change.upgrade
        ) {
            parsed = parser.parse(program)
            query = new Parser.Query(JavaScript, `(jsx_element
                open_tag: (jsx_opening_element name: (nested_identifier) @opening-name)
                close_tag: (jsx_closing_element name: (nested_identifier) @closing-name)
                )`);

            // here: check against source and code.
            // if(node.openingElement.attributes.some(a =>
            //     a.name.name === 'source' &&
            //     a.value.value === source_name
            // )) {
            //     if(node.openingElement.attributes.some(a =>
            //         a.name.name === "code" &&
            //         a.value.value === change.code
            //     )) {
            //         node.children[0].value = change.upgrade
            matches = query.matches(parsed.rootNode).filter(x =>
                x.captures.every(c => parsed.getText(c.node) === "Lens.change")
            )
            matches.forEach(match => {
                program = replace_in_program_by_node(program, match.captures.filter(c => c.name === "closing-name")[0].node, "ChargeCard")

                // here: replace children of the element.

                // drop opening element attributes:
                // node.openingElement.attributes = node.openingElement.attributes.filter(a => !(
                //     a.name.name === "source" &&
                //     a.value.value === source_name
                // ))
                // node.openingElement.attributes = node.openingElement.attributes.filter(a => !(
                //     a.name.name === "code" &&
                //     a.value.value === change.code
                // ))

                program = replace_in_program_by_node(program, match.captures.filter(c => c.name === "opening-name")[0].node, "ChargeCard")
            })
        }

        var remade = program

        fs.writeFile(sourceAddress, remade, err => console.log(err))
    })
}

module.exports = go