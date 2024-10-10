import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import ExtendedClient from "../class/ExtendedClient";

type BotCommand = {
    data: SlashCommandOptionsOnlyBuilder;
    execute: (client: ExtendedClient, interaction: CommandInteraction) => void;
}

export default BotCommand;