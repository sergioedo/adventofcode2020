const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('input.txt', 'UTF-8');

    /// split the contents by new line
    const groupsInfo = data.split(/\r?\n\n/)
        .map(group => {
            const persons = group.split(/\r?\n/)
            const groupAnswers = {}
            persons.map(pa => pa.split('').map(char => {
                groupAnswers[char] = (groupAnswers[char] || 0) + 1
            }))
            const groupInfo = { groupAnswers, numPersons: persons.length }
            // console.log(JSON.stringify(groupInfo,null,4))
            return groupInfo
        })
    
    let count = 0
    groupsInfo.map(gi => {
        count += Object.keys(gi.groupAnswers).length
    })
    console.log(`The answer to part 1 is: ${count}`)
    
    // Part 2
    count = 0
    groupsInfo.map(gi => {
        const answersAll = Object.keys(gi.groupAnswers).filter(key => gi.groupAnswers[key] === gi.numPersons)
        // console.log(`${JSON.stringify(answersAll)} - ${gi.numPersons}`)
        count += answersAll.length
    })
    console.log(`The answer to part 2 is: ${count}`)

} catch (err) {
    console.error(err);
}