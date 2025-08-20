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
        this.summary = "";
        this.client = new OpenAI();
        this.history = [];
        this.history.push({
            role: "system",
            content: instructions + "\n\n" + this.summary
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
                console.log("Summarizing old chat history...");
                console.log("History length:", this.history.length);
                console.log("History:", this.history);
                await this.summarizeOldChatHistory();

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

    // summarize old messages if needed to save on tokens
    async summarizeOldChatHistory() {
        // check if there are more than 6 user messages in the history
        const userMessages = this.history.filter(
            message => message.role === "user" && !message.content.startsWith("Tool")
        );
        console.log("User messages:", userMessages);
        if (userMessages.length > 6) {
            // for debugging, log the entire history to a file
            // get the index of the 4th user message
            let fourthUserMessageIndex = 0;
            let userCount = 0;
            for (let i = 0; i < this.history.length; i++) {
                if (this.history[i].role === "user" && !this.history[i].content.startsWith("Tool")) {
                    userCount++;
                    if (userCount === 4) {
                        fourthUserMessageIndex = i;
                        break;
                    }
                }
            }
            // summarize all messages up to but not including the 4th user message
            const messagesToSummarize = this.history.slice(0, fourthUserMessageIndex);
            const summary = await this.summarizeMessages(messagesToSummarize);
            this.summary += " " + summary;
            // log the summary to a file
            // remove the messages from the history
            this.historyToKeep = this.history.slice(fourthUserMessageIndex);
            this.history = [
                {
                    role: "system",
                    content: this.instructions + "\n\n" + summary
                },
                ...this.historyToKeep
            ];
        }
    }

    async summarizeMessages(messages) {
        // strip the first message (system prompt) from the messages
        const messagesToSummarize = messages.slice(1);
        // add in the old summary to the messages
        messagesToSummarize.push({
            role: "system",
            content: "precious summary before this (your summary will be appended to the end of this):\n\n" + this.summary
        });
        // use gpt-4o-mini to summarize the conversation history
        const conversationText = messagesToSummarize.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
        
        const summaryClient = new OpenAI();
        const response = await summaryClient.responses.create({
            model: 'gpt-4.1-mini',
            input: [
                {
                    role: "system",
                    content: "Summarize this game conversation history concisely, preserving key game state, player actions, and story progress. Focus on what happened, not current status. Example summary format:\n\n'The player chose class [Class] and difficulty [Difficulty] and started their journey at [Center A], then decided to travel to [Center B]. Along the way, they encountered [Challenge X] and chose to [Action Y], which resulted in [Consequence Z]. They successfully arrived at [Center B], visited the center, and completed [Task/Challenge] to earn [Reward]. The player then [Action] before deciding their next destination.'\n\nDo not include events from the existing summary as these are already included. Write a similar narrative summary of the actual events that happened:"
                },
                {
                    role: "user", 
                    content: "summarize this:\n\n" + conversationText
                }
            ]
        });
        // for debugging, log the response to a file
        return response.output_text;
    }

    resetGame(args) {
        console.log("Clearing chat history to reset game...");
        this.history = [];
        this.summary = "";
        this.history.push({
            role: "system",
            content: this.instructions
        });
    }

}

export { llmClass };