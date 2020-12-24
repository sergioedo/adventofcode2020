const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const seats = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(s => s.split(''))

    // Part 1
    const cloneSeats = (seats) => {
        const clone = []
        seats.map(seat => {
            clone.push([...seat])
        })
        return clone
    }

    const equalSeats = (seats1, seats2) => {
        let equals = true
        seats1.map((s1, idx) => {
            if (s1.join('') !== seats2[idx].join('')) equals = false //one row is different
        })
        return equals
    }

    const getSeat = (seats, row, col) => {
        if (seats[row] && seats[row][col]) {
            return seats[row][col]
        } else {
            return '-'  //nothing valid, outside
        }
    }
    const isOccupied = (seatValue) => seatValue === '#'

    const numAdjacentOccupied = (seats, row, col) => {
        return (
            isOccupied(getSeat(seats, row - 1, col - 1)) +
            isOccupied(getSeat(seats, row - 1, col)) +
            isOccupied(getSeat(seats, row - 1, col + 1)) +
            isOccupied(getSeat(seats, row, col - 1)) +
            isOccupied(getSeat(seats, row, col + 1)) +
            isOccupied(getSeat(seats, row + 1, col - 1)) +
            isOccupied(getSeat(seats, row + 1, col)) +
            isOccupied(getSeat(seats, row + 1, col + 1))
        )
    }

    const applyRule = (seats) => {
        const newSeats = cloneSeats(seats)
        seats.map((row, rowIdx) => {
            row.map((seat, seatIdx) => {
                // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
                if (seat === 'L' && numAdjacentOccupied(seats, rowIdx, seatIdx) === 0) newSeats[rowIdx][seatIdx] = '#'
                // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
                if (seat === '#' && numAdjacentOccupied(seats, rowIdx, seatIdx) >= 4) newSeats[rowIdx][seatIdx] = 'L'
            })
        })
        return newSeats
    }

    const numOcuppiedSeats = (seats) => {
        let count = 0
        seats.map(row => {
            row.map(seat => {
                if (seat === '#') count++
            })
        })
        return count
    }

    let changeState = true
    let prevSeats = cloneSeats(seats)
    while (changeState) {
        const newSeats = applyRule(prevSeats)
        changeState = !equalSeats(prevSeats, newSeats)
        prevSeats = newSeats
        // console.log('-------------')
        // newSeats.map(s => console.log(s.join('')))
    }

    console.log(`The answer to part 1 is: ${numOcuppiedSeats(prevSeats)}`)

    // Part 2

    const getNextSeat = (seats, row, col, incRow, incCol) => {
        if (seats[row + incRow]) {
            if (seats[row + incRow][col + incCol]) {
                const seat = seats[row + incRow][col + incCol]
                if (seat === '#' || seat === 'L') { //seat found
                    return seat
                } else {
                    // try to find far away
                    return getNextSeat(seats, row + incRow, col + incCol, incRow, incCol)
                }
            } else {
                return '-'
            }
        } else {
            return '-'
        }
    }

    const numAdjacentOccupied2 = (seats, row, col) => {
        return (
            isOccupied(getNextSeat(seats, row, col, - 1, - 1)) +
            isOccupied(getNextSeat(seats, row, col, - 1, 0)) +
            isOccupied(getNextSeat(seats, row, col, - 1, 1)) +
            isOccupied(getNextSeat(seats, row, col, 0, -1)) +
            isOccupied(getNextSeat(seats, row, col, 0, 1)) +
            isOccupied(getNextSeat(seats, row, col, 1, - 1)) +
            isOccupied(getNextSeat(seats, row, col, 1, 0)) +
            isOccupied(getNextSeat(seats, row, col, 1, 1))
        )
    }

    const applyRule2 = (seats) => {
        const newSeats = cloneSeats(seats)
        seats.map((row, rowIdx) => {
            row.map((seat, seatIdx) => {
                // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
                if (seat === 'L' && numAdjacentOccupied2(seats, rowIdx, seatIdx) === 0) newSeats[rowIdx][seatIdx] = '#'
                // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
                if (seat === '#' && numAdjacentOccupied2(seats, rowIdx, seatIdx) >= 5) newSeats[rowIdx][seatIdx] = 'L'
            })
        })
        return newSeats
    }

    changeState = true
    prevSeats = cloneSeats(seats)
    while (changeState) {
        const newSeats = applyRule2(prevSeats)
        changeState = !equalSeats(prevSeats, newSeats)
        prevSeats = newSeats
    }

    console.log(`The answer to part 2 is: ${numOcuppiedSeats(prevSeats)}`)

} catch (err) {
    console.error(err);
}