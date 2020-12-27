const fs = require('fs')
const path = require('path')

try {
    const numbers = [2, 0, 1, 9, 5, 19]
    // const numbers = [0, 3, 6]

    // Part 1
    let turn = 1
    const turns = []
    let spokenNumbers = {}
    let lastSpoken = -1
    while (turn <= 2020) {
        const startNumber = numbers[turn - 1]
        if (startNumber) { // starter numbers
            lastSpoken = startNumber
        } else {    //playing!
            spokenTurns = spokenNumbers[lastSpoken]
            if (spokenTurns && spokenTurns.length > 1) { //search lastSpoken turn
                lastSpoken = spokenTurns[spokenTurns.length - 1] - spokenTurns[spokenTurns.length - 2]
            } else { //first time
                lastSpoken = 0
            }
        }
        spokenNumbers[lastSpoken] = spokenNumbers[lastSpoken] || []
        spokenNumbers[lastSpoken].push(turn)
        turns.push({ turn, num: lastSpoken })
        turn++
        // console.log(turn)
    }
    // console.log(JSON.stringify(turns, null, 4))
    console.log(`The answer to part 1 is: ${turns[2019].num}`)

    //Part 2
    turn = 1
    lastTurn = {}
    spokenNumbers = {}
    lastSpoken = -1
    while (turn <= 30000000) {
        const startNumber = numbers[turn - 1]
        if (startNumber) { // starter numbers
            lastSpoken = startNumber
        } else {    //playing!
            spokenTurns = spokenNumbers[lastSpoken]
            if (spokenTurns && spokenTurns.length > 1) { //search lastSpoken turn
                lastSpoken = spokenTurns[spokenTurns.length - 1] - spokenTurns[spokenTurns.length - 2]
            } else { //first time
                lastSpoken = 0
            }
        }
        spokenNumbers[lastSpoken] = spokenNumbers[lastSpoken] || []
        spokenNumbers[lastSpoken].push(turn)
        if (spokenNumbers.length > 2) spokenNumbers[lastSpoken] = spokenNumbers[lastSpoken].slice(1)  //optimize memory
        lastTurn.turn = turn
        lastTurn.num = lastSpoken
        turn++
        if (turn % 10000 === 0) console.log(`${(turn / 30000000) * 100}%`)
    }
    console.log(`The answer to part 2 is: ${lastTurn.num}`)

} catch (err) {
    console.error(err);
}