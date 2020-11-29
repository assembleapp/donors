var fs = require('fs')
var Program = require("./program")

const go = (change = null) => {
    var sourceAddress = __dirname + '/../app/javascript/packs/charge.js'
    var source_name = sourceAddress.split("../").slice(-1)[0]

    fs.readFile(sourceAddress, 'utf8', (error, response) => {
        if(error) return console.log(error)
        var source = response

        var program = new Program(source)

        // search for, and perhaps insert, necessary import statement
        var matches = program.query(`
            (import_statement (import_clause (identifier) @identifier) source: (string) @source)
        `).map(x => x.captures.map(c => program.parsed.getText(c.node)))
        if(!matches.some(dependency =>
            dependency[0] === "Lens" &&
            dependency[1].match(/^['"]\.\/assemble\/lens['"]$/))
        ) {
            program.replace_in_program_by_indices(0, 0, "import Lens from './assemble/lens'\n")
        }

        // single out an element to change
        matches = program.query(`
        (jsx_element
            open_tag: (jsx_opening_element name: (identifier) @opening-name)
            close_tag: (jsx_closing_element name: (identifier) @closing-name)
        )
        `).filter(x =>
            x.captures.every(c => program.parsed.getText(c.node) === "ChargeCard")
        )
        matches.forEach(match => {
            program.replace_in_program_by_node(
                match.captures.filter(c => c.name === "closing-name")[0].node,
                "Lens.change"
            )
            program.replace_in_program_by_node(
                match.captures.filter(c => c.name === "opening-name")[0].node,
                `Lens.change source="${source_name}" code="abcd"`
            )
         })

        // restore changed element
        if(change &&
            change.code &&
            change.source === source_name &&
            change.upgrade
        ) {
            matches = program.query(`(jsx_element
                open_tag: (
                    jsx_opening_element
                    name: (nested_identifier) @opening-name
                    attribute: (jsx_attribute (property_identifier) @source_ (#match? @source_ "source") "=" (_) @source )
                    attribute: (jsx_attribute (property_identifier) @code_ (#match? @code_ "code") "=" (_) @code )
                    )
                (jsx_text) @children
                close_tag: (jsx_closing_element name: (nested_identifier) @closing-name)
            ) @element`)

            // (#match? @opening-name "Lens\.change")
            // (#match? @closing-name "Lens\.change")

            console.log(matches[0].captures.map(c => program.parsed.getText(c.node)))
            // matches = query.matches(program.parsed.rootNode).filter(x =>
            //     x.captures.some(c => c.name.match(/-name$/) && program.parsed.getText(c.node) === "Lens.change")
            // )
            //     matches.forEach(match => {
            //         // broken: check against source and code
            //         match.captures.filter(c => c.name === "attr").some(c => {
            //             var attr_name = program.parsed.getText(c.node.children[0])
            //             var attr_value = program.parsed.getText(c.node.children[2])

            //             if(attr_name === "code")
            //                 console.log("code", attr_value)
            //                 //         a.value.value === change.code
            //             if(attr_name === "source")
            //                 console.log("source", attr_value)
            //                 //     a.value.value === source_name
            //         })

            //     program.replace_in_program_by_node(match.captures.filter(c => c.name === "closing-name")[0].node, "ChargeCard")

            //     // broken: replace children of the element
            //     program.replace_in_program_by_node(
            //         match.captures.filter(c => c.name === "children")[0].node,
            //         change.upgrade
            //     )

            //     // broken: drop opening element attributes
            //     match.captures.filter(c => c.name === "attr").reverse().forEach(c => {
            //         var attr_name = program.parsed.getText(c.node.children[0])
            //         if(attr_name === "code" || attr_name === "source")
            //             program.replace_in_program_by_node(source, c.node, "")
            //     })

            //     program.replace_in_program_by_node(match.captures.filter(c => c.name === "opening-name")[0].node, "ChargeCard")
            // })
        }

        var remade = program.source

        fs.writeFile(sourceAddress, remade, err => console.log(err))
    })
}

module.exports = go