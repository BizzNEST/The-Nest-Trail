import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: Missing OPENAI_API_KEY in environment');
}


class llmClass {
    constructor(model, tools, instructions) {
        this.model = model;
        this.tools = tools;
        this.instructions = instructions;
        this.client = new OpenAI();
        this.history = [];
        this.history.push({
            role: "system",
            content: instructions
        })
    }

    async getResponse(message) {
        this.history.push({
            role: "user",
            content: message,
        });

        const tools = this.tools.map(tool => tool.formatOpenAIReadable());
        const MAX_ITERATIONS = 10;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            const response = await this.client.responses.create({
                model: this.model,
                tools: tools,
                input: this.history,
            });

            let hasToolCalls = false;

            // Process all tool calls in the response
            for (const output of response.output) {
                if (output.type == "function_call") {
                    hasToolCalls = true;
                    
                    // Find and execute the matching tool
                    for (const tool of this.tools) {
                        if (tool.name == output.name) {
                            const args = JSON.parse(output.arguments);
                            const result = tool.call(args);
                            console.log(`Tool ${output.name} result:`, result);

                            // Add tool result to history for context
                            this.history.push({
                                role: "user",
                                content: `Tool ${output.name} was called with arguments ${output.arguments} and returned: ${JSON.stringify(result)}`
                            });
                            break;
                        }
                    }
                }
            }

            // If no tool calls were made, add the assistant's response and exit
            if (!hasToolCalls) {
                this.history.push({
                    role: "assistant",
                    content: response.output_text,
                });
                return response.output_text;
            }

            iterations++;
        }

        // If we reach max iterations, return an error message
        const errorMessage = "Error: Maximum iterations reached without a normal response.";
        this.history.push({
            role: "assistant",
            content: errorMessage,
        });
        return errorMessage;
    }

    resetGame(args) {
        console.log("Clearing chat history to reset game...");
        this.history = [];
        this.history.push({
            role: "system",
            content: this.instructions
        });
    }

}

export { llmClass };