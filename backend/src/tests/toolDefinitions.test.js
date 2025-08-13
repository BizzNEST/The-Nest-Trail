import { addItemTool, removeItemTool } from '../llm_tools/toolDefinitions.js';
import sharedInventory from '../../models/sharedInventory.js';
import fetch from 'node-fetch'; 

const API_URL = 'http://localhost:5050/inventory/items'; 

async function testAPI() {
    console.log('Initial Inventory:', sharedInventory.listItems());

    console.log('Adding items...');
    addItemTool.call({
        name: 'Sword',
        description: 'A sharp blade for combat',
        count: 1
    });
    addItemTool.call({
        name: 'Potion',
        description: 'Restores health',
        count: 3
    });
    console.log('Inventory after adding items:', sharedInventory.listItems());

    // Test removing items
    console.log('Removing items...');
    removeItemTool.call({
        name: 'Potion',
        count: 1
    });
    console.log('Inventory after removing items:', sharedInventory.listItems());

    // Test clearing inventory
    console.log('Clearing inventory...');
    sharedInventory.clearInventory();
    console.log('Inventory after clearing:', sharedInventory.listItems());

    // Add a new item after clearing inventory
    console.log('Adding a new item...');
    addItemTool.call({
        name: 'Shield',
        description: 'Protects against attacks',
        count: 1
    });
    console.log('Inventory after adding a new item:', sharedInventory.listItems());

    // Test API
    console.log('Testing API...');
    const response = await fetch(API_URL);
    const items = await response.json();
    console.log('API Response:', items);
}

testAPI().catch(error => console.error('Error during testing:', error));