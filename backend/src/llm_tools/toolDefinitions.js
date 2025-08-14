import { llmTool, llmToolProperty } from './toolClass.js';
import sharedInventory from '../../models/sharedInventory.js';
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
    }
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
        sharedInventory.removeItem(name, count);
        return `Item "${name}" removed successfully.`;
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
  }
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
  }
);

// Simple read tools so the AI can inspect state before/after actions
// const getMoneyTool = new llmTool(
//   'getMoney',
//   'Returns the player\'s current money amount.',
//   {},
//   () => ({ money: sharedInventory.getMoney() })
// );

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

const eventDifficulty = new llmTool(
    'eventDifficulty',
    'Gets difficulty of generated event',
    {
        modifier: new llmToolProperty('difficultyModifier', 'number', 'Positive or negative number to adjust difficulty', true)
    },
    (args) => {
        const num = getRandInt();
        return `The player rolled a ${num}.`;
    }
)

export { addItemTool, removeItemTool, getAllItemsTool, getPossiblePathsTool, getDistanceAndEventCountTool, eventDifficulty, addMoneyTool, removeMoneyTool, listInventoryTool };
