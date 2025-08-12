import { llmClass } from '../llm_handler/llmClass.js';
import { llmTool, llmToolProperty } from '../llm_tools/toolClass.js';

// Initialize LLM with a simple add tool
function add(args) {
    return args.x + args.y;
}

const addTool = new llmTool("add", "Add two numbers", {
    x: new llmToolProperty("x", "number", "The first number"),
    y: new llmToolProperty("y", "number", "The second number"),
}, add);

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';
const llm = new llmClass(OPENAI_MODEL, [addTool]);

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await llm.getResponse(message);
        res.json({ response });
    } catch (error) {
        console.error('LLM API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
