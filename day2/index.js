const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('password_policy.txt', 'UTF-8');

    // split the contents by new line
    const passwords = data.split(/\r?\n/).map((line)=> {
        return {
            minChar: parseInt(line.split(':')[0].split('-')[0]),
            maxChar: parseInt(line.split(':')[0].split('-')[1].split(' ')[0]),
            char: line.split(':')[0].split('-')[1].split(' ')[1],
            password: line.split(':')[1].trim()
        }
    })

    const checkPasswordPolicy = (pp) => {
        const splitParts = pp.password.split(pp.char).length
        return (splitParts>pp.minChar && splitParts<=(pp.maxChar+1))
    }
    
    // part 1
    let count = 0
    passwords.forEach((pp) => {
        if(checkPasswordPolicy(pp)){
            count++
        } /*else {
            console.log(JSON.stringify(pp,null,4))
        }*/
    });
    console.log(`The answer to part 1 is: ${count}`)

    // part 2
    const checkRealPasswordPolicy = (pp) => {  
        return (
            (pp.password[pp.minChar-1] == pp.char && pp.password[pp.maxChar-1] != pp.char)
            ||
            (pp.password[pp.minChar-1] != pp.char && pp.password[pp.maxChar-1] == pp.char)
        )
    }

    count = 0
    passwords.forEach((pp) => {
        if(checkRealPasswordPolicy(pp)){
            count++
        }else {
            console.log(JSON.stringify(pp,null,4))
        }
    });
    console.log(`The answer to part 2 is: ${count}`)

} catch (err) {
    console.error(err);
}