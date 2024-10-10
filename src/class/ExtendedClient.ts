import { Client, Events, GatewayIntentBits, Guild } from "discord.js";
import BotCommand from "../types/BotCommand";
import BotEvent from "../types/BotEvent";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

class ExtendedClient extends Client {
  commands: Map<string, BotCommand> = new Map();
  db: PrismaClient = new PrismaClient();
  constructor(public token: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
    });
  }

  async registerCommands(guild: Guild) {
    for (const cmd of this.commands.values()) {
        try {
             this.rest.setToken(this.token)
            await guild.commands.create(cmd.data.toJSON());
            console.log(`Command ${cmd.data.name} registered on guild ${guild.name}`);
        } catch (error) {
            console.error(`Error registering command ${cmd.data.name}: ${error}`);            
        }
    }
    
  }

  async loadCommands() {
    const commandsFolder = fs.readdirSync(path.join(__dirname, "..", "commands"));
    for (const file of commandsFolder) {
      try {
        const command = (await import(path.join(__dirname, "..", "commands", file))).default as BotCommand;
        this.commands.set(command.data.name, command);
        console.log(`Command ${command.data.name} loaded`);
      } catch (error) {
        console.error(`Error loading command ${file}:`);
        console.error(error)
      }
    }
  }

  async loadEvents() {
    const eventsFolder = fs.readdirSync(path.join(__dirname, "..", "events"));
    for (const file of eventsFolder) {
      try {
        const event = (await import(path.join(__dirname, "..", "events", file))).default as BotEvent;
        if (event.once) {
          this.once(event.name, (...args) => event.execute(this, ...args));
        } else {
          this.on(event.name, (...args) => event.execute(this, ...args));
        }
        console.log(`Event ${event.name} loaded`);
      } catch (error) {
        console.error(`Error loading event ${file}: ${error}`);
      }
    }
  }

  async setup() {
    await this.loadCommands();
    await this.loadEvents();
    const guilds = await this.guilds.fetch()
    for (const guild of this.guilds.cache.values()) {
        await this.registerCommands(guild);
    }
  }
  
  async start() {
    await this.login(this.token);
    this.setup();
  }
}

export default ExtendedClient;
