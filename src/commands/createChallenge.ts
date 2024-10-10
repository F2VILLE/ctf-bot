import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import BotCommand from "../types/BotCommand";
import crypto from "node:crypto";

const createFlag: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("create_chalenge")
    .setDescription("Create a new flag.")
    .addStringOption((option) =>
      option
        .setName("flag")
        .setDescription("The flag of the challenge.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("challenge_name")
        .setDescription("The name of the challenge.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The difficulty of the challenge.")
        .addChoices([
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" },
        ])
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("challenge_link")
        .setDescription("A link to the instructions of the challenge.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (!interaction.guild) return;

    const flag = interaction.options.get("flag")?.value;
    const challenge_name = interaction.options.get("challenge_name")?.value;
    const challenge_link = interaction.options.get("challenge_link")?.value;
    const difficulty = interaction.options.get("difficulty")?.value;
    if (!flag || !challenge_name || !challenge_link || !difficulty) {
      interaction.reply({
        content: "Please provide all the required arguments.",
        ephemeral: true,
      });
      return;
    }

    console.log(flag, challenge_name, difficulty, challenge_link);

    try {
      const flagHash = crypto
        .createHash("sha256")
        .update(flag.toString())
        .digest("hex");

      const flagDB = await client.db.flag.create({
        data: {
          hash: flagHash,
        },
      });

      let user = await client.db.user.findUnique({
        where: {
          userid: interaction.user.id,
        },
      });

      if (!user) {
        user = await client.db.user.create({
          data: {
            userid: interaction.user.id,
            username: interaction.user.username,
          },
        });
      }

      let guildDB = await client.db.guild.findUnique({
        where: {
          id: interaction.guild.id,
        },
      });

      if (!guildDB) {
        guildDB = await client.db.guild.create({
          data: {
            id: interaction.guild.id,
            name: interaction.guild.name,
          },
        });
      }

      await client.db.challenge.create({
        data: {
          flag: {
            connect: {
              id: flagDB.id,
            },
          },

          author: {
            connect: {
              id: user.id,
            },
          },
          name: challenge_name.toString(),
          difficulty: difficulty.toString(),
          guild: {
            connect: {
              id: guildDB.id,
            },
          },
          points:
            difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300,
          description: challenge_link.toString(),
        },
      });

      interaction.reply({
        content: "Challenge created successfully!",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "An error occurred while creating the challenge.",
        ephemeral: true,
      });
    }
  },
};

export default createFlag;
