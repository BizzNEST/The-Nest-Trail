// Import shared inventory for gas  
import sharedInventory from "./sharedInventory.js"

const spawnLocations = [
    "Modesto",
    "Stockton",
    "Salinas",
    "Gilroy"
]

class Stats {
    constructor() {
        this.elapsedMinutes = 0
        this.currentLocation = spawnLocations[Math.floor(Math.random() * spawnLocations.length)]
    }

    getStats() {
        return {
            elapsedMinutes: this.elapsedMinutes,
            currentLocation: this.currentLocation
        }
    }

    updateStatus(timeElapsed, location, distanceTraveled = 0) {
        distanceTraveled = Math.abs(distanceTraveled) // in case the player ever decides to travel backwards
        if (distanceTraveled > 0) {
            let gasGallonsToRemove = distanceTraveled / 30
            // one unit of gas is 1/5th of a gallon
            let gasUnitsToRemove = Math.round(gasGallonsToRemove * 5)
            let result = sharedInventory.removeItem("Gas", gasUnitsToRemove)
            console.log(result)
            if (result.startsWith("Not enough") || result.startsWith("Item not found")) {
                return "Cannot travel because gas is too low.  Time and location remain unchanged.  Please alert the player of this issue."
            }
        }
        this.elapsedMinutes += timeElapsed
        this.currentLocation = location
        let itemList = sharedInventory.listItems()
        // format the item list to be a string
        itemList = itemList.items.map(item => item.name + ": " + item.count).join(", ") + " and $" + itemList.money + " in cash"
        return "Update successful.  Time and location updated.  Current player inventory: " + itemList
    }

    resetStats() {
        this.elapsedMinutes = 0;
        this.currentLocation = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];
    }
}

export default Stats