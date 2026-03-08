"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalculatorTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getCalculatorTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "calculator",
        description: "Useful for performing mathematical calculations. Input should be a mathematical expression string like '2 + 2' or 'sqrt(16)'.",
        schema: zod_1.z.object({
            expression: zod_1.z.string().describe("The mathematical expression to evaluate"),
        }),
        func: async ({ expression }) => {
            try {
                const safeExpression = expression.replace(/[^0-9+\-*/().\sMath\w]/g, "");
                const mathKeys = Object.getOwnPropertyNames(Math);
                const mathArgs = mathKeys.map(key => `const ${key} = Math.${key};`).join('\n');
                const result = new Function(`${mathArgs} return ${safeExpression}`)();
                return JSON.stringify({ result });
            }
            catch (error) {
                return `Error evaluating expression: ${error.message}`;
            }
        },
    });
};
exports.getCalculatorTool = getCalculatorTool;
//# sourceMappingURL=calculator.js.map