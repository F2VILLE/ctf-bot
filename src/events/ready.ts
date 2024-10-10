import BotEvent from "../types/BotEvent";

const ready: BotEvent = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user?.tag}`);
    }    
}

export default ready;