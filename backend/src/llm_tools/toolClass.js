import sharedInventory from "../../models/sharedInventory.js";
import sharedToolCallTracker from "../../models/sharedToolCalls.js";

class llmToolProperty {

    constructor(name, type, description, required = true) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.required = required;
    }
}

class llmTool {
    constructor(name, description, properties, execute, userReturnFunction = null) {
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
        this.userReturnFunction = userReturnFunction;
    }

    // Make the instance callable, delegating to execute
    call(args) {
        const result = this.execute(args, sharedInventory);
        
        // If there's a user return function, generate user notification data
        if (this.userReturnFunction) {
            const userReturn = this.userReturnFunction(args, result);
            
            // Only track non-null user returns
            if (userReturn !== null && userReturn !== undefined) {
                sharedToolCallTracker.addToolCall(this.name, args, userReturn);
            }
        }
        
        return result;
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