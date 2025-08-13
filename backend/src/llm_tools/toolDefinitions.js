import { llmTool, llmToolProperty } from './toolClass.js';
import sharedInventory from '../../models/sharedInventory.js';
import shopInventory from '../../models/shopInventory.js';
import gameState from '../../models/gameState.js';
import { incrementMoves } from '../../models/incrementMoves.js';

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

const getShopInfoTool = new llmTool(
    'getShopInfo',
    'Retrieves shop information for the current location with dynamic pricing based on moves',
    {
        location: new llmToolProperty('location', 'string', 'The name of the location', true),
    },
    (args) => {
        const { location } = args;
        incrementMoves();
        const shopInfo = shopInventory[location];
        if (!shopInfo) {
            throw new Error(`No shop information available for location: ${location}`);
        }

        const adjustedShopInfo = shopInfo.map(item => ({
            item: item.item,
            price: Math.round(item.basePrice * (1 + gameState.moves * 0.05)),
        }));

        return adjustedShopInfo;
    }
);

export { addItemTool, removeItemTool, getShopInfoTool };