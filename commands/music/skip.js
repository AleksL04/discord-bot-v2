// commands/skip.js
import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip the current song');

function execute(interaction, client) {
  const player = client.manager.players.get(interaction.guild.id);

  if (!player) {
    return interaction.reply({
      content: 'There is nothing playing in this server!',
      ephemeral: true,
    });
  }

  if (interaction.member.voice.channel?.id !== player.voiceChannelId) {
    return interaction.reply({
      content:
        'You need to be in the same voice channel as the bot to use this command!',
      ephemeral: true,
    });
  }

  if (!player.current) {
    return interaction.reply({
      content: 'There is nothing playing right now!',
      ephemeral: true,
    });
  }

  const currentTrack = player.current;
  player.skip();

  interaction.reply(`Skipped: **${currentTrack.title}**`);
}

export default {
  data: data,
  execute: execute,
};