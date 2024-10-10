import { SlashCommandBuilder } from "discord.js";
import BotCommand from "../types/BotCommand";

const flag: BotCommand = {
    data: new SlashCommandBuilder()
        .setName("flag")
        .setDescription("Submit your flag to validate a challenge.")
        .addStringOption(option => option.setName("flag").setDescription("The flag to submit.").setRequired(true))
        ,
    execute(client, interaction) {
        
    }
}

export default flag;