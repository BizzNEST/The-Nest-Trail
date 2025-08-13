import gameState from "./gameState.js";

export function incrementMoves() {
    gameState.moves += 1;
    console.log(`Move count updated: ${gameState.moves}`);
}