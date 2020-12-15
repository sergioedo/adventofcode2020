const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('expense_list.txt', 'UTF-8');

    // split the contents by new line
    const numbers = data.split(/\r?\n/).map(line=>parseInt(line));
    
    // part 1
    numbers.forEach((number, index) => {
        const bingo = numbers.filter((n,idx) => (index!==idx && ((number + n) == 2020)))
        if(bingo.length>0) {
            console.log(`${index}:${number} + ${bingo[0]} => 2020!`)
            console.log(`The answer to part 1 is: ${number*bingo[0]}`)
        }
    });


    // part 2
    numbers.forEach((number, index) => {
        numbers.forEach((number2, index2) => {
            const bingo = numbers.filter((n,idx) => 
                (
                    index!==index2 && index!==idx && index2!==idx && //diferent numbers
                    ((number + number2 + n) == 2020)
                )
            )
            
            if(bingo.length>0) {
                console.log(`${number} + ${number2} + ${bingo[0]} => 2020!`)
                console.log(`The answer to part 2 is: ${number*number2*bingo[0]}`)
            }
        });
    });
} catch (err) {
    console.error(err);
}