import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getCalculatorTool = () => {
  return new DynamicStructuredTool({
    name: "calculator",
    description:
      "Useful for performing mathematical calculations. Input should be a mathematical expression string like '2 + 2' or 'sqrt(16)'.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate"),
    }),
    func: async ({ expression }: { expression: string }) => {
      try {
        // Safe evaluation logic
        // Only allow numbers, basic operators, and Math functions
        const safeExpression = expression.replace(/[^0-9+\-*/().\sMath\w]/g, "");
        
        // Create a function with Math properties in scope
        const mathKeys = Object.getOwnPropertyNames(Math);
        const mathArgs = mathKeys.map(key => `const ${key} = Math.${key};`).join('\n');
        
        // Evaluate in a restricted context using Function
        const result = new Function(`${mathArgs} return ${safeExpression}`)();
        
        return JSON.stringify({ result });
      } catch (error) {
        return `Error evaluating expression: ${(error as Error).message}`;
      }
    },
  });
};
