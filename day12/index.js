const fs = require('fs')
const path = require('path')

try {
    // read contents of the file
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'UTF-8');

    /// split the contents by new line
    const instructions = data.split(/\r?\n/)
        .filter(l => l != '')  //last line
        .map(s => {
            return {
                action: s.split('')[0],
                value: parseInt(s.split('').slice(1).join(''))
            }
        })

    // Part 1
    const basicShipMove = (position, instruction) => {
        const newPosition = { ...position }
        if (instruction.action === 'N') {  //move to North
            newPosition.y -= instruction.value
        } else if (instruction.action === 'S') {  //move to South
            newPosition.y += instruction.value
        } else if (instruction.action === 'E') {  //move to East
            newPosition.x += instruction.value
        } else if (instruction.action === 'W') {  //move to West
            newPosition.x -= instruction.value
        } else console.log("ERROR: bad move!")
        return newPosition
    }

    const getDirection = (angle) => {
        const a = Math.abs(angle + 360) % 360
        if (a === 0) return 'E'
        if (a === 90) return 'N'
        if (a === 180) return 'W'
        if (a === 270) return 'S'
        console.log("ERROR: bad direction!")
        return 'lost'
    }

    const getAngle = (direction) => {
        if (direction === 'E') return 0
        if (direction === 'N') return 90
        if (direction === 'W') return 180
        if (direction === 'S') return 270
        console.log("ERROR: bad angle!")
        return -1
    }

    const moveShip = (position, instruction) => {
        let newPosition = { ...position }
        if (instruction.action === 'F') {  //move on, follow orientation
            newPosition = basicShipMove(position, { action: position.dir, value: instruction.value })
        } else if (instruction.action === 'L') {  //change orientation
            newPosition.dir = getDirection(getAngle(position.dir) + instruction.value)
            // console.log(`new direction: ${position.dir} + L${instruction.value} -> ${newPosition.dir}`)
        } else if (instruction.action === 'R') {  //change orientation
            newPosition.dir = getDirection(getAngle(position.dir) - instruction.value)
            // console.log(`new direction: ${position.dir} - R${instruction.value} -> ${newPosition.dir}`)
        } else {
            newPosition = basicShipMove(position, instruction)
        }
        return newPosition
    }

    let positions = [{ x: 0, y: 0, dir: 'E' }] // [x: west/east, y:north/south, orientation(N/S/E/W)]
    instructions.map(i => {
        const lastPosition = positions[positions.length - 1]
        positions.push(moveShip(lastPosition, i))  // add new positions, after move
    })
    // console.log(JSON.stringify(positions, null, 4))
    const last = positions[positions.length - 1]
    const result = Math.abs(last.x) + Math.abs(last.y)
    console.log(`The answer to part 1 is: ${result}`)

    // Part 2

    const waypointMove = (position, instruction) => {
        const newPosition = { ...position }
        if (instruction.action === 'N') {  //move waypoint to North
            newPosition.wpY -= instruction.value
        } else if (instruction.action === 'S') {  //move waypoint to South
            newPosition.wpY += instruction.value
        } else if (instruction.action === 'E') {  //move waypoint to East
            newPosition.wpX += instruction.value
        } else if (instruction.action === 'W') {  //move waypoint to West
            newPosition.wpX -= instruction.value
        } else console.log("ERROR: bad move!")
        return newPosition
    }

    const wayPointRotate = (position, instruction) => {
        const newPosition = { ...position }
        if (instruction.action === 'L') {
            // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
            const a = instruction.value
            //3, -1,  //-1, -3   //-3, 1    // 1, 3
            if (a === 90) { newPosition.wpX = position.wpY; newPosition.wpY = -position.wpX }
            else if (a === 180) { newPosition.wpX = -position.wpX; newPosition.wpY = -position.wpY }
            else if (a === 270) { newPosition.wpX = -position.wpY; newPosition.wpY = position.wpX }
        } else if (instruction.action === 'R') {
            // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
            const a = instruction.value
            //3, -1   // 1, 3   //-3, 1   //-1, -3
            if (a === 90) { newPosition.wpX = -position.wpY; newPosition.wpY = position.wpX }
            else if (a === 180) { newPosition.wpX = -position.wpX; newPosition.wpY = -position.wpY }
            else if (a === 270) { newPosition.wpX = position.wpY; newPosition.wpY = -position.wpX }
        }
        return newPosition
    }

    const shipToWayPointMove = (position, value) => {
        const newPosition = { ...position }
        newPosition.x += (position.wpX * value)
        newPosition.y += (position.wpY * value)
        return newPosition
    }

    const moveShip2 = (position, instruction) => {
        let newPosition = { ...position }
        if (instruction.action === 'F') {  //move on, follow orientation
            // console.log(position)
            newPosition = shipToWayPointMove(position, instruction.value)
            // console.log(newPosition)
        } else if (instruction.action === 'L' || instruction.action === 'R') {  //change orientation
            newPosition = wayPointRotate(position, instruction)
            // console.log(`new direction: ${position.dir} + L${instruction.value} -> ${newPosition.dir}`)
        } else {
            newPosition = waypointMove(position, instruction)
        }
        return newPosition
    }

    positions = [{ x: 0, y: 0, wpX: 10, wpY: -1 }] // [x: west/east, y:north/south, orientation(N/S/E/W), waypointX: west/east, waypointY:north/south]
    instructions.map(i => {
        const lastPosition = positions[positions.length - 1]
        positions.push(moveShip2(lastPosition, i))  // add new positions, after move
    })
    console.log(JSON.stringify(positions, null, 4))
    const last2 = positions[positions.length - 1]
    const result2 = Math.abs(last2.x) + Math.abs(last2.y)
    console.log(`The answer to part 2 is: ${result2}`)

} catch (err) {
    console.error(err);
}