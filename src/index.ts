const OpenAI = require("openai-api");
import { Application, Conversation } from "@dasha.ai/sdk/.";
import { readFileSync } from "fs";
import config from "./endpoints.config";
const dasha = require("@dasha.ai/sdk");
const openai = new OpenAI(config.OPENAI_SECRET);
const MAX_PROMPT_LINES = 100;

//Provide a prompt the AI and it will generate a conversation for you that matches
const prompt: string[] = readFileSync("./resources/prompt.txt", "utf-8").split(
  "\n"
);

if (process.argv[0].length < 10) {
  console.log("Please provide a valid Phone number");
  process.exit(1);
}

(async () => {
  const app: Application<any, any> = await dasha.deploy("./dasha", {
    apiKey: config.DASHA_SECRET,
  });
  await app.start();
  //19205731143
  const conv: Conversation = app.createConversation({
    phone: process.argv[0],
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
})();

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
