// events/interactionCreate.js

// Combine 'name' and 'execute' into one object and export it as the default
export default {
    name: 'interactionCreate',
    
    execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'There was an error executing this command!',
                ephemeral: true,
            });
        }
    }
};