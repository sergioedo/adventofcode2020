const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const numbers = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(n => parseInt(n))
    

    const checkPreambleSum = (number, list) => {
        let check = false
        if(number == 11974) console.log(list.length)
        list.map(n1 => {
            list.map(n2 => {
                // if(number == 11974) console.log(n1+n2)
                if((n1 != n2) && (n1+n2 == number)) check = true
            })
        })
        return check
    }

    const preamble = 25
    const errors = numbers.map((n, idx) =>{
        if(idx>=preamble) { // start after preamble
            const preambleList = numbers.slice(idx - preamble, idx)
            if(!checkPreambleSum(n, preambleList)) return n // return only when error
        }
    }).filter(n => n !== undefined) // remove correct ones (return undefined)

    console.log(`The answer to part 1 is: ${errors[0]}`)

    // Part 2
    const target = errors[0]
    const minRange = 2
    const maxRange = numbers.length - 1
    for(range=minRange; range<=maxRange; range++) {
        const maxIdx = numbers.length - range 
        for(idx=0;idx<=maxIdx;idx++){
            const rangeList = numbers.slice(idx, idx+range)
            const sum = rangeList.reduce((a,b) => a+b, 0)
            if(sum === target) {
                const result = rangeList.sort((a,b)=>(a-b))  //Sort to get smallest and largest
                console.log(result.toString())
                console.log(`The answer to part 2 is: ${idx+1} - ${idx+range} (${range}) --> ${result[0] + result[result.length-1]}`)
            }
        }
    }

} catch (err) {
    console.error(err);
}