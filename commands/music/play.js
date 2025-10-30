// Import necessary classes from discord.js
import { SlashCommandBuilder } from 'discord.js';
import { PermissionsBitField } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('play') // Command name
  .setDescription('Play a song in a voice channel') // Command description
  .addStringOption(
    (option) =>
      option
        .setName('song') // Option name
        .setDescription('The song to play') // Option description
        .setRequired(true), // Make the option required
  );
 
// Define the execute function for the play command
async function execute(interaction) {
  // Get the player instance and song query
  const query = interaction.options.getString('song', true);
 
  // Get the voice channel of the user and check permissions
  const voiceChannel = interaction.member.voice.channel;
 
  if (!voiceChannel) {
    return interaction.reply(
      'You need to be in a voice channel to play music!',
    );
  }
 
  if (
    interaction.guild.members.me.voice.channel &&
    interaction.guild.members.me.voice.channel !== voiceChannel
  ) {
    return interaction.reply(
      'I am already playing in a different voice channel!',
    );
  }
 
  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Connect)
  ) {
    return interaction.reply(
      'I do not have permission to join your voice channel!',
    );
  }
 
  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Speak)
  ) {
    return interaction.reply(
      'I do not have permission to speak in your voice channel!',
    );
  }
 
  try {
    // Reply to the user that the song has been added to the queue
    return interaction.reply(
      `${query} has been added to the queue!`,
    );
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return interaction.reply('An error occurred while playing the song!');
  }
}

export default {
  data: data,
  execute: execute,
};