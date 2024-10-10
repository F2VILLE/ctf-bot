import { InteractionType, SlashCommandBuilder } from "discord.js";
import BotCommand from "../types/BotCommand";

const ping: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong."),

    execute(client, interaction) {
        interaction.reply("Pong!");
    }
}

export default ping;