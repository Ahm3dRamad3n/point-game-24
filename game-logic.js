/**
 * Point Game 24 - Game Logic Module
 * This file contains all the core game logic functions
 * It's provided separately for reference and customization
 */

// ============================================
// GAME LOGIC - Core Functions
// ============================================

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {number[]} array - Array to shuffle
 * @returns {number[]} Shuffled array
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Generate a new set of 4 random game numbers (1-13)
 * @returns {number[]} Array of 4 random numbers
 */
function generateGameNumbers() {
    const allNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
    const shuffled = shuffle(allNumbers);
    return shuffled.slice(0, 4);
}

/**
 * Safely evaluate a mathematical expression
 * Validates integer division and follows proper order of operations
 * @param {string} expression - Mathematical expression (e.g., "1 + 2 * 3 - 7")
 * @returns {number|null} Result or null if invalid
 */
function safeEvaluate(expression) {
    try {
        // Validate expression contains only numbers, operators, and spaces
        if (!/^[\d\s+\-*/()]+$/.test(expression)) {
            return null;
        }

        // Check for division operations and validate they result in integers
        const divisionPattern = /(\d+)\s*\/\s*(\d+)/g;
        let match;
        while ((match = divisionPattern.exec(expression)) !== null) {
            const dividend = parseInt(match[1], 10);
            const divisor = parseInt(match[2], 10);

            // Check for division by zero
            if (divisor === 0) {
                return null;
            }

            // Check for non-integer division
            if (dividend % divisor !== 0) {
                return null;
            }
        }

        // Use Function constructor for safe evaluation
        const result = Function('"use strict"; return (' + expression + ')')();

        // Ensure result is a valid number
        if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
            return null;
        }

        return result;
    } catch {
        return null;
    }
}

/**
 * Find a solution for the given numbers
 * Uses brute-force approach with all permutations
 * @param {number[]} numbers - Array of 4 numbers
 * @returns {string|null} Solution expression or null if no solution
 */
function getSolution(numbers) {
    const operators = ["+", "-", "*", "/"];

    // Generate all permutations of the 4 numbers
    for (let p1 = 0; p1 < 4; p1++) {
        for (let p2 = 0; p2 < 4; p2++) {
            if (p2 === p1) continue;

            for (let p3 = 0; p3 < 4; p3++) {
                if (p3 === p1 || p3 === p2) continue;

                for (let p4 = 0; p4 < 4; p4++) {
                    if (p4 === p1 || p4 === p2 || p4 === p3) continue;

                    const currentOrder = [numbers[p1], numbers[p2], numbers[p3], numbers[p4]];

                    // Try all combinations of 3 operators
                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 4; j++) {
                            for (let k = 0; k < 4; k++) {
                                const op1 = operators[i];
                                const op2 = operators[j];
                                const op3 = operators[k];

                                // Build expression
                                const expression = `${currentOrder[0]} ${op1} ${currentOrder[1]} ${op2} ${currentOrder[2]} ${op3} ${currentOrder[3]}`;

                                // Evaluate using safe evaluation
                                const result = safeEvaluate(expression);

                                if (result !== null && result === 24) {
                                    return expression;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return null;
}

/**
 * Check if a solution exists for the given numbers
 * @param {number[]} numbers - Array of 4 numbers
 * @returns {boolean} True if solution exists
 */
function isSolvable(numbers) {
    return getSolution(numbers) !== null;
}

/**
 * Validate user expression
 * @param {string} expression - User input expression
 * @param {number[]} gameNumbers - The 4 game numbers
 * @returns {object} Validation result with valid flag and error message
 */
function validateExpression(expression, gameNumbers) {
    const exp = expression.trim();

    if (!exp) {
        return { valid: false, error: "Expression cannot be empty." };
    }

    // Extract all numbers from the expression
    const numberMatches = exp.match(/\d+/g) || [];
    const usedNumbers = numberMatches.map((n) => parseInt(n, 10));

    // Check if exactly 4 numbers are used
    if (usedNumbers.length !== 4) {
        return { valid: false, error: "Please use exactly 4 numbers." };
    }

    // Check if all used numbers are from the game set
    const gameNumbersCopy = [...gameNumbers];
    for (const num of usedNumbers) {
        const index = gameNumbersCopy.indexOf(num);
        if (index === -1) {
            return {
                valid: false,
                error: `Please use the given numbers only: ${gameNumbers.join(", ")}`,
            };
        }
        gameNumbersCopy.splice(index, 1);
    }

    // Count operators
    const operatorMatches = exp.match(/[+\-*/]/g) || [];
    if (operatorMatches.length !== 3) {
        return { valid: false, error: "Please use exactly 3 operators." };
    }

    return { valid: true, expression: exp };
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Generate a new game
const numbers = generateGameNumbers();
console.log("Numbers:", numbers); // [5, 12, 3, 8]

// Example 2: Find a solution
const solution = getSolution(numbers);
console.log("Solution:", solution); // "5 * 3 + 12 - 8"

// Example 3: Check if solvable
const solvable = isSolvable(numbers);
console.log("Solvable:", solvable); // true

// Example 4: Evaluate an expression
const result = safeEvaluate("5 * 3 + 12 - 8");
console.log("Result:", result); // 19

// Example 5: Validate user input
const validation = validateExpression("5 * 3 + 12 - 8", numbers);
console.log("Valid:", validation.valid); // true
console.log("Error:", validation.error); // undefined
*/

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

// If using ES6 modules, uncomment these exports:
/*
export {
    shuffle,
    generateGameNumbers,
    safeEvaluate,
    getSolution,
    isSolvable,
    validateExpression
};
*/

// If using CommonJS, uncomment these exports:
/*
module.exports = {
    shuffle,
    generateGameNumbers,
    safeEvaluate,
    getSolution,
    isSolvable,
    validateExpression
};
*/
