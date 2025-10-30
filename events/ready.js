// events/ready.js
import { Events } from 'discord.js'; // <-- 1. Import Events

export default {
    name: Events.ClientReady, // <-- 2. Change this from 'ready'
    once: true,
    
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        // Initialize the Moonlink Manager with the bot's user ID
        // This is required for the manager to function correctly
        client.manager.init(client.user.id);
        console.log('Moonlink Manager initialized');
    }
};