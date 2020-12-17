const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('input.txt', 'UTF-8');

    // split the contents by new line
    const rows = data.split(/\r?\n/)
    const rowLength = rows[0].length
    const lastRowIdx = rows.length - 1

    const treesCounter = (right, down) => {
        let rowIdx = 0
        let colIdx = 0
        let count = 0
        
        rows.map((row)=> {
            colIdx = (colIdx + right) % rowLength
            rowIdx += down
            if(rowIdx < lastRowIdx && rows[rowIdx][colIdx]=='#') count++
        })

        return count
    }
    
    console.log(`The answer to part 1 is: ${treesCounter(3,1)}`)
    
    // Part 2
    const count1 = treesCounter(1,1)
    const count2 = treesCounter(3,1)
    const count3 = treesCounter(5,1)
    const count4 = treesCounter(7,1)
    const count5 = treesCounter(1,2)
    console.log(`The answer to part 2 is: ${count1*count2*count3*count4*count5}`)

} catch (err) {
    console.error(err);
}