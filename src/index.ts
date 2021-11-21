const OpenAI = require("openai-api");
const dasha = require("@dasha.ai/sdk");
import { Application, Conversation } from "@dasha.ai/sdk/.";
import { Request, Response } from "express";
import { readFileSync } from "fs";
import config from "./endpoints.config";
const express = require("express");
const app = express();
const port = 1211; // default port to listen
const openai = new OpenAI(config.OPENAI_SECRET);
const MAX_PROMPT_LINES = 100;
app.use(express.json());

// start the Express server
const server = app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
process.on("uncaughtException", () => {
  server.close();
});
process.on("SIGTERM", () => {
  server.close();
});

let prompt: string[];
let phone: string;
let name: string;

app.post("/", async function (req: Request, res: Response) {
  res.send("Call Request Recieved!");
  if (req.body.phone) {
    phone = req.body.phone;
  }
  if (req.body.name) {
    name = req.body.name;
  }
  if (req.body.prompt) {
    prompt = req.body.prompt.split("\n");
  }

  if (!phone || phone.length < 10) {
    console.log("Please provide a valid Phone number");
    return;
  }

  if (!prompt || prompt.length == 0) {
    console.log("No Prompt found, reading default");
    prompt = readFileSync(`./resources/prompt.txt`, "utf-8").split("\n");
  }
  const app: Application<any, any> = await dasha.deploy("./dasha", {
    apiKey: config.DASHA_SECRET,
  });
  await app.start();
  const conv: Conversation = app.createConversation({
    phone: phone,
    name: name,
  });

  app.setExternal("askQuestion", async (args: any, convo: Conversation) => {
    let data: string = await askQuestion(args.msg);
    console.log(args);
    return data;
  });

  conv.audio.tts = "dasha";
  const result = await conv.execute({ channel: "audio" });
  console.log(result.output);
  await app.stop();
  app.dispose();
});

//Provide a prompt the AI and it will generate a conversation for you that matches

async function askQuestion(msg: string): Promise<string> {
  if (prompt.length > MAX_PROMPT_LINES) {
    prompt.shift();
  }
  prompt[prompt.length - 1] += msg;
  prompt.push(`Friend:`);
  console.log(prompt.join("\n"));
  try {
    const gptResponse = await openai.complete({
      engine: "davinci",
      prompt: prompt.join("\n"),
      temperature: 0.5,
      max_tokens: 120,
      top_p: 0.3,
      frequency_penalty: 1.0,
      presence_penalty: 0.3,
      stop: ["\n"],
    });
    console.log(gptResponse.data.choices[0].text);
    prompt[prompt.length - 1] += gptResponse.data.choices[0].text;
    prompt.push(`You:`);
    console.log(prompt);
    return gptResponse.data.choices[0].text;
  } catch (err) {
    console.log(err);
  }
  return "Was not able to communicate with OpenAI Servers";
}
