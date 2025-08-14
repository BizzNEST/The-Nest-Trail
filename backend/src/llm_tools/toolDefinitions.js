import { llmTool, llmToolProperty } from './toolClass.js';
import sharedInventory from '../../models/sharedInventory.js';
import { getRandInt } from '../services/randomNum.js';

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

export { addItemTool, removeItemTool, eventDifficulty };