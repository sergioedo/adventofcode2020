const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('input.txt', 'UTF-8');

    const getNextRange = (direction, range) => {
        const middle = range.min + ((range.max - range.min + 1) / 2)
        if(direction == 'F' || direction == 'L' ) {
            return  { min: range.min, max: middle - 1} // go lower
        } else if(direction == 'B' || direction == 'R') {
            return  { min: middle, max: range.max} // go higher
        }
    }

    // split the contents by new line
    const passIDs = data.split(/\r?\n/).map(pass => {
        let rowRange = { min: 0, max: 127}
        rowRange = getNextRange(pass[0], rowRange)
        rowRange = getNextRange(pass[1], rowRange)
        rowRange = getNextRange(pass[2], rowRange)
        rowRange = getNextRange(pass[3], rowRange)
        rowRange = getNextRange(pass[4], rowRange)
        rowRange = getNextRange(pass[5], rowRange)
        rowRange = getNextRange(pass[6], rowRange)
        let colRange = { min: 0, max: 7}
        colRange = getNextRange(pass[7], colRange)
        colRange = getNextRange(pass[8], colRange)
        colRange = getNextRange(pass[9], colRange)

        const passID = (rowRange.min * 8) + colRange.min
        // console.log(pass + ': ' + JSON.stringify(rowRange) + ' - ' + JSON.stringify(colRange) + ' --> ' + passID)
        return { pass, passID, row: rowRange.min, col:colRange.min }
    }).sort((a,b)=>b.passID-a.passID)
    
    console.log(`The answer to part 1 is: ${passIDs[0].passID}`)
    
    // Part 2
    passIDs.sort((a,b)=>a.passID-b.passID)
    .map((p, idx) => {
        if(passIDs[idx+1] && (p.passID + 1 != passIDs[idx+1].passID)) console.log(`${JSON.stringify(p)} - ${JSON.stringify(passIDs[idx+1])}`)
        // if(passIDs[idx+1]) console.log(`${JSON.stringify(p)} - ${JSON.stringify(passIDs[idx+1])}`)

        // console.log(`${idx}: ${p.pass} - ${p.passID}`)
    })
    
    // console.log(`The answer to part 2 is: ${count}`)

} catch (err) {
    console.error(err);
}