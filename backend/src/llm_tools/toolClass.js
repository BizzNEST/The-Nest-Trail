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
        this.requiredPropertyNameArray = this.requiredProperties;
        const formattedProperties = Object.fromEntries(
            Object.entries(properties || {}).map(([key, prop]) => [
                key,
                { type: prop.type, description: prop.description }
            ])
        );
        this.parameters = {
            type: "object",
            properties: formattedProperties,
            required: this.requiredPropertyNameArray,
            additionalProperties: false
        };
        this.execute = execute;
    }

    // Make the instance callable, delegating to execute
    call(args) {
        return this.execute(args);
    }

    formatOpenAIReadable() {
        return {
            type: "function",
            name: this.name,
            description: this.description,
            parameters: this.parameters,
            strict: true
        };
    }
}

export { llmTool, llmToolProperty };