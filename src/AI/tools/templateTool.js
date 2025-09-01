import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go two levels up, then into AI/
const filePath = path.join(__dirname, "../../AI/telegram_types.json");

const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
// console.log("Loaded JSON:", jsonData);

// Define Zod schema properly with descriptions (optional but recommended)
const generateTemplateSchema = z.object({
  userRequest: z.string().describe("User input request string"),
});

export const generateTemplate = tool(
  async ({ userRequest }) => {
    const limitedTypes = JSON.stringify(Object.keys(jsonData).slice(0, 20), null, 2);
    return `
You are a Telegram template generator.  
Here are the available types:  
${limitedTypes}

The user request is: "${userRequest}"  

⚡ Rules:
- Output ONLY valid JSON (no explanations, no comments, no markdown).  
- The JSON must contain a root object with key "data".  
- Inside "data", include the required fields according to the available types.  
- If the user’s request matches multiple possible types, pick the most relevant.  
- Use realistic placeholder values if the user does not specify details.  

Now generate the JSON template.
  `;
  },
  {
    name: "generateTemplate",
    description: "Generate Telegram template JSON using available types",
    schema: generateTemplateSchema,
  }
);
