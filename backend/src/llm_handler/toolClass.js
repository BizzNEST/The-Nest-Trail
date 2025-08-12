class llmToolProperty {

    constructor(name, type, description, required = true) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.required = required;
    }
}

class llmTool {
    constructor(name, description, properties, execute) {
        this.name = name;
        this.description = description;
        this.requiredProperties = Object.keys(properties).filter(key => properties[key].required);
        this.requiredPropertyNameArray = this.requiredProperties.map(property => properties[property].name);
        this.parameters = {
            type: "object",
            properties: properties || {},
            required: this.requiredPropertyNameArray,
        };
        this.execute = execute;
    }

    // Make the instance callable, delegating to execute
    call(...args) {
        return this.execute(...args);
    }
}

export default {
    llmTool,
    llmToolProperty,
};