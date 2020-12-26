const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const info = data.split(/\r?\n/)
        .filter(l => l != '')  //last line

    const departTime = parseInt(info[0])
    const buses = info[1].split(',')
        .filter(v => v !== 'x') // remove out of service buses
        .map(b => parseInt(b)) // bus number
    // const departTime = 939
    // const buses = [7, 13, 59, 31, 19]

    // Part 1
    const nextStopTimes = buses.map(b => {
        return {
            bus: b,
            nextStopTime: departTime - (departTime % b) + b
        }
    }).sort((a, b) => a.nextStopTime - b.nextStopTime)
    // console.log(JSON.stringify(nextStopTimes, null, 4))
    const waitTime = nextStopTimes[0].nextStopTime - departTime
    const nextBus = nextStopTimes[0].bus
    const result = waitTime * nextBus
    console.log(`The answer to part 1 is: bus ${nextBus} * ${waitTime} = ${result}`)

    //Part 2
    const buses2 = info[1].split(',')
        .map((b, idx) => {
            return {
                bus: b,
                t: idx
            }
        })
        .filter(b => b.bus !== 'x') // remove out of service buses
        .map(b => {
            b.bus = parseInt(b.bus)
            return b
        })
        .sort((a, b) => b.bus - a.bus)

    const busesTest = [{ bus: 7, t: 0 }, { bus: 13, t: 1 }, { bus: 0, t: 2 }, { bus: 0, t: 3 }, { bus: 59, t: 4 }, { bus: 0, t: 5 }, { bus: 31, t: 6 }, { bus: 19, t: 7 }]
        .filter(b => b.bus !== 0) // remove out of service buses
        .map(b => {
            b.bus = parseInt(b.bus)
            return b
        })
    // .sort((a, b) => a.bus - b.bus)  //optimize search

    const busesTest2 = [{ bus: 3, t: 0 }, { bus: 5, t: 1 }, { bus: 6, t: 0 }].sort((a, b) => b.bus - a.bus)
    // .sort((a, b) => a.bus - b.bus)
    // console.log(JSON.stringify(buses2, null, 4))

    const checkStopTime = (frequency, time) => (time % frequency === 0)

    function lcm_two_numbers(x, y) {
        if ((typeof x !== 'number') || (typeof y !== 'number'))
            return false;
        return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
    }

    function gcd_two_numbers(x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    }

    const getNextStopTimesMatch = (buses) => {
        if (buses.length === 1) { // trivial case, next stop time from bus
            return { time: buses[0].bus - buses[0].t, bus: buses[0].bus, t: buses[0].t }
        } else {    //recursive 
            const b = buses[0]
            const busList = buses.slice(1)
            const nextBus = getNextStopTimesMatch(busList)

            let found = false
            let time = nextBus.time
            while (!found) {
                found = checkStopTime(b.bus, time + b.t)
                if (!found) time += nextBus.bus
                console.log(time)
            }
            return {
                time,
                bus: lcm_two_numbers(b.bus, nextBus.bus)
            }
        }
    }
    const result2 = getNextStopTimesMatch(buses2, 0).time
    console.log(`The answer to part 2 is: ${result2}`)

} catch (err) {
    console.error(err);
}