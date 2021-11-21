import * as dotenv from "dotenv";
dotenv.config();

export default {
  OPENAI_SECRET: process.env.OPENAI_SECRET,
  DASHA_SECRET: process.env.DASHA_SECRET,
};
