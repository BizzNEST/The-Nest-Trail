import { llmTool, llmToolProperty } from './toolClass.js';
import sharedInventory from '../../models/sharedInventory.js';
import sharedStats from '../../models/sharedStats.js';
import { getRandInt } from '../services/randomNum.js';
import { getPossiblePaths, getDistanceAndEventCount } from '../controllers/routeFinder.js';

// Item tools
const addItemTool = new llmTool(
    'addItem',
    'Adds an item to the inventory',
    {
        name: new llmToolProperty('name', 'string', 'Name of the item', true),
        description: new llmToolProperty('description', 'string', 'Description of the item', true),
        count: new llmToolProperty('count', 'number', 'Number of items to add', true),
    },
    (args) => {
        const { name, description, count } = args;
        sharedInventory.addItem(name, description, count);
        return `Item "${name}" added successfully.`;
    },
    (args, result) => ({
        tool: 'addItem',
        title: 'Item Added',
        message: `${args.name} x${args.count}`,
        count: args.count,
        name: args.name,
        description: args.description
    })
);

const removeItemTool = new llmTool(
    'removeItem',
    'Removes an item from the inventory',
    {
        name: new llmToolProperty('name', 'string', 'Name of the item', true),
        count: new llmToolProperty('count', 'number', 'Number of items to remove', true),
    },
    (args) => {
        const { name, count } = args;
        const result = sharedInventory.removeItem(name, count);
        return result;
    },
    (args, result) => {
        // Only show toast for successful removals
        const isSuccess = result.includes('Successfully removed');
        
        if (!isSuccess) {
            return null; // Don't show toast for errors
        }
        
        return {
            tool: 'removeItem',
            title: 'Item Removed',
            message: `${args.name} x${args.count}`,
            count: args.count,
            name: args.name
        };
    }
);



const addMoneyTool = new llmTool(
  'addMoney',
  'Increases the player\'s money by a positive amount.',
  {
    amount: new llmToolProperty('amount', 'number', 'Positive amount to add (same units as Inventory.money)', true),
    // reason: new llmToolProperty('reason', 'string', 'Optional reason for audit logs', false),
  },
  (args) => {
    const { amount } = args;
    const amt = Number(amount);
    if (!Number.isInteger(amt) || amt <= 0) throw new Error('Amount must be a positive integer.');
    sharedInventory.addMoney(amt);                 // uses your Inventory.addMoney
    return `Money increased by ${amt}. Balance: ${sharedInventory.getMoney()}`;
  },
  (args, result) => ({
    tool: 'addMoney',
    title: 'Money Gained',
    message: `+$${args.amount}`,
    amount: args.amount
  })
);

const removeMoneyTool = new llmTool(
  'removeMoney',
  'Decreases the player\'s money by a positive amount.',
  {
    amount: new llmToolProperty('amount', 'number', 'Positive amount to remove (same units as Inventory.money)', true),
    // reason: new llmToolProperty('reason', 'string', 'Optional reason for audit logs', false),
  },
  (args) => {
    const { amount } = args;
    const amt = Number(amount);
    if (!Number.isInteger(amt) || amt <= 0) throw new Error('Amount must be a positive integer.');
    sharedInventory.removeMoney(amt);              // uses your Inventory.removeMoney
    return `Money decreased by ${amt}. Balance: ${sharedInventory.getMoney()}`;
  },
  (args, result) => ({
    tool: 'removeMoney',
    title: 'Money Lost',
    message: `-$${args.amount}`,
    amount: args.amount
  })
);

// Simple read tools so the AI can inspect state before/after actions
const getMoneyTool = new llmTool(
  'getMoney',
  'Returns the player\'s current money amount.',
  {},
  () => ({ money: sharedInventory.getMoney() })
);

const listInventoryTool = new llmTool(
  'listInventory',
  'Returns the list of inventory items with counts.',
  {},
  () => ({ 
    money: sharedInventory.getMoney(),
    items: sharedInventory.listItems()
    })
);


const getAllItemsTool = new llmTool(
    'getAllItems',
    'Gets all items currently in the inventory',
    {},
    (args) => {
        const items = sharedInventory.listItems();
        if (items.length === 0) {
            return 'The inventory is currently empty.';
        }
        return `Current inventory:\n${items.map(item => `- ${item.name}: ${item.description} (Count: ${item.count})`).join('\n')}`;
    }
);

// Map and Journey tools

const getPossiblePathsTool = new llmTool(
    'getPossiblePaths',
    'Gets all possible destinations from the current location including their distance and the number of random events that will be encountered before arrival.  Use this whenever the player has the option to travel to a new location.',
    {
        currentLocation: new llmToolProperty('currentLocation', 'string', 'The current location (e.g. "Watsonville")', true),
    },
    (args) => {
        const { currentLocation } = args;
        const possiblePaths = getPossiblePaths(currentLocation);
        return `Possible paths from ${currentLocation}:\n${possiblePaths.map(path => `- ${path}`).join('\n')}`;
    }
);

const getDistanceAndEventCountTool = new llmTool(
    'getDistanceAndEventCount',
    'Gets the distance and number of random events that will be encountered before arrival for a given destination.',
    {
        currentLocation: new llmToolProperty('currentLocation', 'string', 'The current location (e.g. "Watsonville")', true),
        destination: new llmToolProperty('destination', 'string', 'The destination to get the distance and event count for (e.g. "Modesto")', true),
    },
    (args) => {
        const { currentLocation, destination } = args;
        const { distance, events } = getDistanceAndEventCount(currentLocation, destination);
        return `Distance and event count from ${currentLocation} to ${destination}:\n${distance} miles, exactly ${events} events MUST be encountered before arrival.  Do not tell the player the number of events only the distance, but make sure to create that number of events before arrival at the center.`;
    }
);


let GAME_DIFFICULTY_MODIFIER = 0 // this is a global modifier to the difficulty of the game
const eventDifficulty = new llmTool(
    'rollDice',
    'Rolls a d20 for an event, a player action, or anything that could be somewhat random.  A 20 is good, a 1 is very bad.',
    {
        modifier: new llmToolProperty('difficultyModifier', 'number', 'Positive or negative modifier to the roll', true)
    },
    (args) => {
        const { modifier } = args;
        const num = getRandInt();
        console.log("eventDifficulty: " + (num + modifier + GAME_DIFFICULTY_MODIFIER))
        if (modifier != 0 && GAME_DIFFICULTY_MODIFIER != 0) {
            return `The player rolled a ${num}.  With the modifier of ${modifier} and the global difficulty modifier of ${GAME_DIFFICULTY_MODIFIER}, the result is ${num + modifier + GAME_DIFFICULTY_MODIFIER}. The outcome of whatever you were rolling for should be based on this.`;
        } else if (modifier != 0) {
            return `The player rolled a ${num}.  With the modifier of ${modifier}, the result is ${num + modifier}. The outcome of whatever you were rolling for should be based on this.`;
        } else if (GAME_DIFFICULTY_MODIFIER != 0) {
            return `The player rolled a ${num}.  With the global difficulty modifier of ${GAME_DIFFICULTY_MODIFIER}, the result is ${num + GAME_DIFFICULTY_MODIFIER}. The outcome of whatever you were rolling for should be based on this.`;
        } else {
            return `The player rolled a ${num}.  The outcome of whatever you were rolling for should be based on this.`;
        }
    },
    (args, result) => {
        const { modifier } = args;
        const rollMatch = result.match(/rolled a (\d+)/);
        const finalMatch = result.match(/result is (\d+)/);
        const rolled = rollMatch ? parseInt(rollMatch[1]) : 0;
        const finalResult = finalMatch ? parseInt(finalMatch[1]) : rolled;
        
        return {
            tool: 'rollDice',
            title: '🎲 Dice Roll',
            message: `Rolled ${rolled}${modifier !== 0 ? ` (${finalResult} total)` : ''}`,
            rolled: rolled,
            modifier: modifier,
            finalResult: finalResult
        };
    }
)

const setGameDifficultyTool = new llmTool(
    'setGameDifficulty',
    'Sets the global game difficulty modifier. Easy = 0, Normal = -2, Hard = -4, Impossible = -6, NESTMARE = -10.',
    {
        difficulty: new llmToolProperty('difficulty', 'string', 'Difficulty level: "easy", "normal", "hard", "impossible", or "nestmare"', true)
    },
    (args) => {
        const { difficulty } = args;
        const difficultyLower = difficulty.toLowerCase();
        
        switch (difficultyLower) {
            case 'easy':
                GAME_DIFFICULTY_MODIFIER = 2;
                return 'Game difficulty set to Easy (modifier: 2). The trail will be forgiving!';
            case 'normal':
                GAME_DIFFICULTY_MODIFIER = 0;
                return 'Game difficulty set to Normal (modifier: 0). A balanced challenge awaits.';
            case 'hard':
                GAME_DIFFICULTY_MODIFIER = -2;
                return 'Game difficulty set to Hard (modifier: -4). The trail will test your skills!';
            case 'impossible':
                GAME_DIFFICULTY_MODIFIER = -4;
                return 'Game difficulty set to Impossible (modifier: -4). Only the most skilled will survive!';
            case 'nestmare':
                GAME_DIFFICULTY_MODIFIER = -6;
                return 'Game difficulty set to NESTMARE (modifier: -6)';
            default:
                throw new Error('Invalid difficulty level. Choose: easy, normal, hard, impossible, or nestmare');
        }
    }
)

// Stats tools
const getStatsTool = new llmTool(
    'getStats',
    'Gets the current game stats including elapsed time and current location',
    {},
    (args) => {
        const stats = sharedStats.getStats();
        return `Current game stats:\n- Time elapsed: ${stats.elapsedMinutes} minutes\n- Current location: ${stats.currentLocation}`;
    }
);

const updateStatsTool = new llmTool(
    'updateStats',
    'Updates the game stats with new time elapsed, location, and optional distance traveled.  This should be called every time before you respond to the player.',
    {
        timeElapsed: new llmToolProperty('timeElapsed', 'number', 'Number of minutes to add to elapsed time.  Whatever you deem fit, but assume the player generally travels at 60mph (or one mile per minute) when on the road.', true),
        location: new llmToolProperty('location', 'string', 'New current location. Either a center or between centers.', true),
        distanceTraveled: new llmToolProperty('distanceTraveled', 'number', 'Distance traveled in miles (0 if no travel)', true)
    },
    (args) => {
        const { timeElapsed, location, distanceTraveled = 0 } = args;
        const result = sharedStats.updateStatus(timeElapsed, location, distanceTraveled);
        return result;
    },
    (args, result) => {
        const { timeElapsed, location, distanceTraveled = 0 } = args;
        
        console.log('[UPDATE_STATS] User return called with:', { timeElapsed, location, distanceTraveled });
        
        // Only show toasts for meaningful updates
        if (timeElapsed <= 0 && distanceTraveled <= 0) {
            console.log('[UPDATE_STATS] Skipping toast - no meaningful changes');
            return null; // Don't show toast for minor updates
        }
        
        let title = '';
        let message = '';
        
        if (distanceTraveled > 0) {
            title = '🚗 Traveling';
            message = `${distanceTraveled} miles to ${location}`;
        } else if (timeElapsed > 0) {
            title = '⏱️ Time Passed';
            message = `${timeElapsed} minutes at ${location}`;
        }
        
        const userReturn = {
            tool: 'updateStats',
            title: title,
            message: message,
            timeElapsed: timeElapsed,
            location: location,
            distanceTraveled: distanceTraveled
        };
        
        console.log('[UPDATE_STATS] Returning user return:', userReturn);
        return userReturn;
    }
);

export { addItemTool, removeItemTool, getAllItemsTool, getPossiblePathsTool, getDistanceAndEventCountTool, eventDifficulty, addMoneyTool, removeMoneyTool, listInventoryTool, getMoneyTool, getStatsTool, updateStatsTool, setGameDifficultyTool };
