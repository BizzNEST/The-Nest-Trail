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
    // NEW: Track Money in inventory
    this.money = 0;
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
     if (!Number.isInteger(count) || count <= 0) {
      throw new Error('Invalid remove count.')
     }
    const existingItem = this.items.find(item => item.name === name);
    if (!existingItem) {
      console.warn(`Item with name "${name}" not found.`);
      return;
    }
  
    if (existingItem.count < count) {
      const message = `Not enough ${name} to remove. Available count: ${existingItem.count}`;
      console.log(message);
      return message;
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
    return {
      items: this.items,
      money: this.money
    };
  }
  
  setMoney(value) {
    if (!Number.isInteger(value)|| value < 0) {
      throw new Error('Invalid money value')
    }
    this.money = value;
  }

  getMoney() {
    return this.money;
  }

  addMoney(amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Amount to add must be a positive integer')
    }
    this.money += amount;
    return this.money;
  }

  removeMoney(amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Amount to remove must be a positive integer')
    }
    if (this.money < amount) {
      const message = `Insufficient funds. Current balance: ${this.money}`;
      console.log(message);
      return message;
    }
    this.money -= amount;
    return this.money;
  }
}

export { Inventory, Item };