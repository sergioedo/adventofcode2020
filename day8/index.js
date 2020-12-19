const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const instructions = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(line => {
            return {
                cmd: line.split(' ')[0],
                param: parseInt(line.split(' ')[1].replace("+", ''))
            }
        })

    const cloneCode = (instructions) => {
        return instructions.map(i => { //clone array
            return { ...i }  //clone instruction
        })
    }

    const execute = (instructions) => {
        //Execute instructions
        let count = 0
        let line = 0
        let run = true
        let end = false
        while (run && !end) {
            const i = instructions[line]
            // console.log(`line ${line+1}:${JSON.stringify(i)}`) //Debug to find error
            if (!i.executed) {
                if (i.cmd === 'acc') {
                    count += i.param
                    line++
                } else if (i.cmd === 'jmp') {
                    line += i.param
                } else if (i.cmd === 'nop') {
                    line++
                }
                i.executed = true
            } else {
                run = false //avoid loop, exit execution
            }
            if(line>=instructions.length) end = true // program end
        }
        return { count, end }
    }

    console.log(`The answer to part 1 is: ${execute(cloneCode(instructions)).count}`)

    // Part 2
    
    // Try each jmp/nop
    instructions.map((i, idx) => {
        const modCode = cloneCode(instructions)
        if(i.cmd === 'jmp') {
            modCode[idx].cmd = 'nop'
        } else if(i.cmd === 'nop') {
            modCode[idx].cmd = 'jmp'
        }
        if(i.cmd === 'jmp' || i.cmd === 'nop') {
            const res = execute(modCode)
            if(res.end) console.log(`The answer to part 2 is: error on line ${idx+1}: ${i.cmd}, count: ${res.count}`)
        }
    })

} catch (err) {
    console.error(err);
}