import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
import travelContext from "./prompt.js"; // Import the travel context
import fs from "fs"; // Import fs to read files

dotenv.config();

const client = new BedrockRuntimeClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

const modelId = "meta.llama3-1-70b-instruct-v1:0";

// Read transportation events from JSON file
const calendarEventsJSON = fs.readFileSync("/Users/zaidt/Desktop/aws-sustainability-hackathon-2024-team-9/backend/src/llm/calendarTest.json")
const calendarEventsT = JSON.parse(calendarEventsJSON);
const transportationEventsJson = fs.readFileSync("/Users/zaidt/Desktop/aws-sustainability-hackathon-2024-team-9/backend/src/llm/transportationEventTest.json", "utf-8");
const transportationEvents = JSON.parse(transportationEventsJson);

// Prompt the user for a question
const newCtx = travelContext.replace("CALENDAREVENTST", JSON.stringify(calendarEventsT));

// Include transportation events in the travel context if needed
const newerCtx = newCtx.replace("TRANSPORTATIONEVENTS", JSON.stringify(transportationEvents));


// The conversation starts with the user's question
const conversation = [
  {
    role: "user", // User's question first
    content: [{ text: newerCtx }],
  },
];

const command = new ConverseCommand({
  modelId,
  messages: conversation,
  inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
});

const main = async () => {
  try {
    console.log("Travel Context:", newerCtx);
    const response = await client.send(command);
    const responseText = response.output.message.content[0].text;
    console.log("Response from model:", responseText);
  } catch (err) {
    console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    process.exit(1);
  }
};

main();
