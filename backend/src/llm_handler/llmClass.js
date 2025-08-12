import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';

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
    }

    async getResponse(message) {
        let isToolCall = false;
        this.history.push({
            role: "user",
            content: message,
        });
        const response = await this.client.responses.create({
            model: this.model,
            tools: this.tools,
            input: this.history,
        });
        this.history.push({
            role: "assistant",
            content: response.output_text,
        });

        return response.output_text;
    }
}



const llm = new llmClass(OPENAI_MODEL, []);
const response = await llm.getResponse("remember the number 12");
console.log(response);
const response2 = await llm.getResponse("What is the number times 10?");
console.log(response2);