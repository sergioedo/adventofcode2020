const fs = require('fs');

try {
    // read contents of the file
    const data = fs.readFileSync('input.txt', 'UTF-8');

    const validatePass = (pass) => {
        const mandatoryFields = ['byr','iyr','eyr','hgt','hcl','ecl','pid']
        return !mandatoryFields.some(atr => {
            return (pass[atr] === undefined)
         })
    }

    const testRange = (n, min, max) => {
        const num = parseInt(n)
        return (n>=min && n<=max)
    }

    const test = {"ecl":"grn","hgt":"155cm","pid":"000337122","hcl":"#99ff22","eyr":"2025","byr":"1997","iyr":"2012"}
    const validatePass2 = (pass) => {
        let valid = validatePass(pass)
        valid = valid && /^[0-9]{4}$/.test(pass.byr) && testRange(pass.byr, 1920, 2002) // (Birth Year) - four digits; at least 1920 and at most 2002.
        valid = valid && /^[0-9]{4}$/.test(pass.iyr) && testRange(pass.iyr, 2010, 2020) // (Issue Year) - four digits; at least 2010 and at most 2020.
        valid = valid && /^[0-9]{4}$/.test(pass.eyr) && testRange(pass.eyr, 2020, 2030) // (Expiration Year) - four digits; at least 2020 and at most 2030.
        valid = valid && /^(\d+)(cm|in)$/.test(pass.hgt) && // (Height) - a number followed by either cm or in:
                    (/^(\d+)cm$/.test(pass.hgt) && testRange(pass.hgt.replace(/cm/,''), 150, 193) // If cm, the number must be at least 150 and at most 193.
                    || /^(\d+)in$/.test(pass.hgt) && testRange(pass.hgt.replace(/in/,''), 59, 76)// If in, the number must be at least 59 and at most 76.
                    )
        valid = valid && /^#[a-f0-9]{6}$/.test(pass.hcl) // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        valid = valid && /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(pass.ecl) // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        valid = valid && /^[0-9]{9}$/.test(pass.pid) // pid (Passport ID) - a nine-digit number, including leading zeroes.

        return valid
    }

    // split the contents by new line
    const passList = data.split(/\r?\n\n/)
        .map(p => {
            const attrs = p.split(/\r?\n/).flatMap(l => l.split(' '))
            const pass = {}
            attrs.map(attr => {
                const kv = attr.split(':')
                pass[kv[0]] = kv[1]
                // console.log('>' + attr)
            })
            return pass
            // console.log(JSON.stringify(pass,null,4))
        })
    
    let count = 0
    passList.map(p => {
        if(validatePass(p)) count++
    })
    
    console.log(`The answer to part 1 is: ${count}`)
    
    // Part 2
    count = 0
    passList.map(p => {
        if(validatePass2(p)) count++
    })   
    
    console.log(validatePass2(test))
    console.log(`The answer to part 2 is: ${count}`)

} catch (err) {
    console.error(err);
}