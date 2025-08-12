class Item {
  constructor(name, description, count) {
    this.name = name;
    this.description = description;
    this.count = count;
  }
}

class Inventory {
  constructor() {
    this.items = [];
  }

  addItem(name, description, count) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid item name.');
    }
    if (!description || typeof description !== 'string') {
      throw new Error('Invalid item description.');
    }
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error('Invalid item count.');
    }
    const existingItem = this.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.count += count;
    } else {
      const newItem = new Item(name, description, count);
      this.items.push(newItem);
    }
  }

  removeItem(name, count) {
    const existingItem = this.items.find(item => item.name === name);
    if (!existingItem) {
      console.warn(`Item with name "${name}" not found.`);
      return;
    }
  
    if (existingItem.count < count) {
      throw new Error(`Not enough items to remove. Available count: ${existingItem.count}`);
    }
  
    existingItem.count -= count;
  
    if (existingItem.count === 0) {
      this.items = this.items.filter(item => item.name !== name);
    }
  }

  clearInventory() {
    this.items = [];
    console.log('Inventory has been cleared.');
  }

  listItems() {
    return this.items;
  }
}

export { Inventory, Item };