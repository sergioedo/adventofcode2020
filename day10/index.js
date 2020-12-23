const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const adapters = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(n => parseInt(n))
        .sort((a, b) => (a - b))  //Sort to get smallest and largest

    // add my device
    const maxValue = adapters[adapters.length - 1]
    const joltages = [
        0,
        ...adapters,
        maxValue + 3
    ]

    const counter = [0, 0, 0] //counts 1, 2 or 3 jolts diffs
    let joltage = 0
    joltages.map(a => {
        if (joltage + 1 === a) {
            counter[0]++
        } else if (joltage + 2 === a) {
            counter[1]++
        } else if (joltage + 3 === a) {
            counter[2]++
        } else {
            console.log('Error! Can\'t connect more adapaters!')
        }
        joltage = a
    })

    const result = counter[0] * counter[2]
    console.log(`The answer to part 1 is: ${result} (joltage ${joltage})`)

    // Part 2
    const checkInputOutput = (input, output) => (input + 1 === output || input + 2 === output || input + 3 === output)
    
    // First try, fail...too expensive to go through all tree branches
    let debug = 0
    const getValidConnectionsFail = (jList) => {
        // initial case, test first element
        if (jList.length === 1) {    // check if is valid (end), count 1 valid combination
            debug++
            // process.stdout.write('.')
            if (debug % 500000 == 0) console.log(debug)
            return 1
        } else {                    // recursive, test the rest of the list
            // // Test 3 possible different sublist (3-jolts maximum), with 3 next values (3-Tree)
            let count = 0
            
            if (jList.length > 1 && checkInputOutput(jList[0], jList[1])) {
                let reducedJList = [...jList].slice(1)
                count += getValidConnectionsFail(reducedJList)
                // console.log(`0> ${jList[0]}, ${reducedJList} (${count})`)
            }
            if (jList.length > 2 && checkInputOutput(jList[0], jList[2])) {
                let reducedJList = [...jList].slice(2)
                count += getValidConnectionsFail(reducedJList)
                // console.log(`1> ${jList[0]}, ${reducedJList} (${count})`)
            }
            if (jList.length > 3 && checkInputOutput(jList[0], jList[3])) {
                let reducedJList = [...jList].slice(3)
                count += getValidConnectionsFail(reducedJList)
                // console.log(`2> ${jList[0]}, ${reducedJList} (${count})`)
            }

            return count
        }
    }

    const getValidConnections = (jList) => {
        // initial case, test first element
        if (jList.length === 1) {    // check if is valid (end), count 1 valid combination
            return [1,0,0]  //last 3 counts
        } else {                    // recursive, split first element and test the rest of the list
            const input = jList[0]
            const reducedJList = [...jList].slice(1)

            const count = [0,0,0]   //store combinations of list, list.slice(1) and list.slice(2) (subarrays)
            const countList = getValidConnections(reducedJList)
            if(checkInputOutput(input, reducedJList[0])) { // normal extend connecting to 1st adapter
                count[0] = countList[0] // continue, single combination  
                count[1] = countList[0] // shift values
                count[2] = countList[1]
            }
            if(checkInputOutput(input, reducedJList[1])) { // add combinations, connecting directly with second adapter on the list
                count[0] += countList[1] // add combinations on 2nd adapter  
            }
            if(checkInputOutput(input, reducedJList[2])) { // add combinations, connecting directly with third adapter on the list
                count[0] += countList[2] // add combinations on 3th adapter  
            }

            return count
        }
    }

    // const test = [0, 16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4].sort((a, b) => (a - b)) 
    // const test = [0, 28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3].sort((a, b) => (a - b)) 
    // const count = getValidConnections(test)[0]
    const count = getValidConnections(joltages)[0]

    console.log(`The answer to part 2 is: ${count}`)

} catch (err) {
    console.error(err);
}