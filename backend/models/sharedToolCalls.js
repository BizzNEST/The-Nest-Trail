// Shared tool call tracker for real-time user notifications

class ToolCallTracker {
    constructor() {
        this.toolCalls = [];
        this.lastId = 0;
    }

    addToolCall(toolName, args, userReturn) {
        const toolCall = {
            id: ++this.lastId,
            toolName,
            args,
            userReturn,
            timestamp: Date.now()
        };
        
        this.toolCalls.push(toolCall);
        
        // Keep only the last 50 tool calls to prevent memory issues
        if (this.toolCalls.length > 50) {
            this.toolCalls = this.toolCalls.slice(-50);
        }
        
        console.log(`[TRACKER] Tool call tracked: ${toolName} with ID ${toolCall.id}`, { userReturn });
        return toolCall.id;
    }

    getNewToolCalls(lastId = 0) {
        return this.toolCalls.filter(call => call.id > lastId);
    }

    clearOldToolCalls(olderThan = 60000) { // Clear calls older than 1 minute
        const cutoff = Date.now() - olderThan;
        this.toolCalls = this.toolCalls.filter(call => call.timestamp > cutoff);
    }
}

const sharedToolCallTracker = new ToolCallTracker();

export default sharedToolCallTracker;
