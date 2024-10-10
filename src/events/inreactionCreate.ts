import { Events } from "discord.js";
import BotEvent from "../types/BotEvent";

const interactionCreate: BotEvent = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

export default interactionCreate;