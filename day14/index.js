const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const code = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(line => {
            let type = line.split('=')[0].trim()
            let typeValue = 0
            let value = line.split('=')[1].trim()
            if (type !== 'mask') { // mem[XXX]
                type = 'mem'
                typeValue = parseInt(line.split('=')[0].trim().split(']')[0].split('[')[1])
                value = parseInt(value)
            }
            return { type, typeValue, value }
        })
    // console.log(JSON.stringify(code, null, 4))


    // Part 1
    const applyMask = (value, mask) => {
        let result = ''
        mask.split('').map((bMask, bIdx) => {
            let bit = value[bIdx]
            if (bMask !== 'X') bit = bMask // mask overwrite bit value
            result += bit
        })
        return result
    }

    const memAssign = (value, mask) => {
        const binValue = value.toString(2).padStart(36, '0')
        const binFinalValue = applyMask(binValue, mask)
        return parseInt(binFinalValue, 2)
    }

    let mem = {} // store mem positions and values
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    code.map(i => {
        if (i.type === 'mask') { // set new mask
            mask = i.value
        } else { // mem assignment
            mem[i.typeValue] = memAssign(i.value, mask)
        }
    })

    let result = 0
    Object.keys(mem).map(k => {
        const v = mem[k]
        // console.log(v)
        result += v
    })

    console.log(`The answer to part 1 is: ${BigInt(result)}`)

    //Part 2

    const addBit = (addrList, bit) => {
        return addrList.map(addr => {
            return bit + addr
        })
    }

    const getMemAddresses = (addr, mask) => {
        if (addr.length === 1) {
            if (mask[0] === '0') {
                return [addr[0]]
            } else if (mask[0] === '1') {
                return ['1']
            } else if (mask[0] === 'X') {
                return ['0', '1']
            }
        } else {
            const bit = addr[0]
            const subAddr = addr.slice(1)
            const subMask = mask.slice(1)
            const subAddresses = getMemAddresses(subAddr, subMask)
            if (mask[0] === '0') {
                return addBit(subAddresses, addr[0])
            } else if (mask[0] === '1') {
                return addBit(subAddresses, '1')
            } else if (mask[0] === 'X') {
                return addBit(subAddresses, '0').concat(addBit(subAddresses, '1'))
            }
        }
        return [addr]
    }

    mem = {} // store mem positions and values
    mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    code.map(i => {
        if (i.type === 'mask') { // set new mask
            mask = i.value
        } else { // mem assignment
            const binAddr = i.typeValue.toString(2).padStart(36, '0')
            addrList = getMemAddresses(binAddr, mask)
            addrList.map(addr => {
                mem[addr] = i.value
            })
        }
    })

    result = 0
    Object.keys(mem).map(k => {
        const v = mem[k]
        // console.log(v)
        result += v
    })

    console.log(`The answer to part 2 is: ${result}`)

} catch (err) {
    console.error(err);
}