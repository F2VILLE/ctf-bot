import { ClientEvents } from "discord.js";
import ExtendedClient from "../class/ExtendedClient";

type BotEvent = {
    name: keyof ClientEvents;
    once: boolean;
    execute: (client: ExtendedClient, ...args: any[]) => void;
}

export default BotEvent;