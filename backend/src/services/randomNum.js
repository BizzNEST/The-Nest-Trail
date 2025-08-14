// random number generator
function getRandInt() {
    const min = 1;
    const max = 20;
    // lower = worse event
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getRandInt };