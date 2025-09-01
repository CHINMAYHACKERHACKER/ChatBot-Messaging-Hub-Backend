import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import { generateTemplate } from "./tools/templateTool.js";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
})

const agent = createReactAgent({
    llm: model,
    tools: [
        generateTemplate
    ]
})

export default agent;