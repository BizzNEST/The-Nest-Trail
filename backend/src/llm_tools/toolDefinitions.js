import { llmTool, llmToolProperty } from './toolClass.js';
import sharedInventory from '../../models/sharedInventory.js';

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
  () => ({ items: sharedInventory.listItems() })
);

export {
  addItemTool,
  removeItemTool,
  addMoneyTool,
  removeMoneyTool,
  getMoneyTool,
  listInventoryTool
};