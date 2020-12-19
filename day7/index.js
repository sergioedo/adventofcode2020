const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const bagsInfo = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(line => {
            const blocks = line.split('contain')
            const bag = blocks[0].replace('bags', '').trim()
            const bags = blocks[1].replace('.', '').trim() //remove final pint
                .split(',') // list of bags
                .filter(s => s!== 'no other bags') // remove no bags
                .map(b => {
                    const parts = b.trim().split(' ')
                    const num = parts[0]
                    const bagName = parts.slice(1, parts.length - 1).join(' ')

                    return { bag: bagName, num }
                })

            return { bag, bags }
        }).filter(b => b.bag != '')
    
    const canContainBag = (bagsInfo, bagName, findBagName) => {
        const bag = bagsInfo.filter(b => b.bag === bagName)[0]
        const containBag = bag.bags && bag.bags.filter(b => b.bag === findBagName).length
        const canContainOnBags = bag.bags && bag.bags.some(b => canContainBag(bagsInfo, b.bag, findBagName))
        return containBag || canContainOnBags
    }

    let count = 0
    bagsInfo.map(bi => {
        if (canContainBag(bagsInfo, bi.bag, 'shiny gold')) {
            count++
        }
        // console.log(`${JSON.stringify(bi)}`)
    })
    console.log(`The answer to part 1 is: ${count} / ${bagsInfo.length}`)
    
    // Part 2
    const countBags = (bagsInfo, bagName) => {
        const bag = bagsInfo.filter(b => b.bag === bagName)[0]  //get bag info
        
        let totalBags = 0
        if(bag.bags && bag.bags.length) {
            const numBags = (bag.bags.map(b => b.num).reduce((prev, value) => parseInt(prev) + parseInt(value), 0))
            const numSubBags = bag.bags
            .map(b => {
                return (b.num * countBags(bagsInfo, b.bag))
            })
            .reduce((prev, value) => parseInt(prev) + parseInt(value), 0)
            totalBags = numBags + numSubBags
            // console.log(`${bagName}: ${numBags} + ${numSubBags} = ${totalBags}`)
        }
        return totalBags
    }

    console.log(`The answer to part 2 is: ${countBags(bagsInfo, 'shiny gold')}`)

} catch (err) {
    console.error(err);
}