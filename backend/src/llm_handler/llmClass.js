import dotenv from 'dotenv';
import OpenAI from "openai";
import { llmTool, llmToolProperty } from '../llm_tools/toolClass.js';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1';

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
}

function add(args) {
    console.log("Adding " + args.x + " and " + args.y);
    return args.x + args.y;
}

export { llmClass };