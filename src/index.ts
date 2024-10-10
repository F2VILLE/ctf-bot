import ExtendedClient from "./class/ExtendedClient";
import {config} from "dotenv"
config()
const client = new ExtendedClient(process.env.BOT_TOKEN!);
client.start();