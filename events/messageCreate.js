// events/messageCreate.js

export default {
    name: 'messageCreate',

    execute(message, client) {
        // Ignore messages from bots or messages without the prefix
        const prefix = client.config?.prefix || '!';
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        // Extract the command name and arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if the command exists
        const command = client.commands.get(commandName);
        if (!command) return;

        // Execute the command
        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    }
};