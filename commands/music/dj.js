// commands/dj.js
import { SlashCommandBuilder } from 'discord.js';
import { GoogleGenAI } from "@google/genai";
import config from "../../config.js"

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const systemPrompt = `You are a playlist assistant. Your only task is to generate a list of 10 songs based on the user's request.
You MUST output a single, valid JSON array.
Each element in the array must be a string in the format: "Song Name by Artist".
Do NOT output anything else (like "Here is your list:" or \`\`\`json ... \`\`\`).
Your entire response must be ONLY the JSON array.`;


const data = new SlashCommandBuilder()
    .setName('dj') // Command name
    .setDescription('Creates a playlist using Gemini based on your prompt') // Command description
    .addStringOption(
        (option) =>
            option
                .setName('prompt') // Option name
                .setDescription('The theme or vibe for the playlist') // Option description
                .setRequired(true), // Make the option required
    );

async function execute(interaction, client) {
    // We defer the reply because searching for a song can take time.
    // This prevents the interaction from "failing"
    await interaction.deferReply();

    // Step 1: Check if the user is in a voice channel.
    const { channel } = interaction.member.voice;
    if (!channel) {
        return interaction.editReply('You need to join a voice channel first!');
    }

    // Step 2: Get the search query from the command's *options*.
    const query = interaction.options.getString('prompt');
    let playlist;

    try {
        console.log(`Generating playlist for: "${query}"...`);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction: systemPrompt
            },
            // 2. NEW: This forces the model to output valid JSON
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // 3. UPDATED: We now parse the JSON string, we don't .split()
        const rawText = response.text;
        playlist = JSON.parse(rawText);

    } catch (error) {
        console.error("Error generating content:", error);
        return interaction.editReply('There was an error generating the playlist from the AI.');
    }
    // Step 3: Create a player for the guild.
    const player = client.manager.players.create({
        guildId: interaction.guild.id,
        voiceChannelId: channel.id,
        textChannelId: interaction.channel.id,
        autoPlay: true,
    });

    // Step 4: Connect to the voice channel.
    player.connect();

    for (const song of playlist) {
        // Step 5: Search for the requested track.
        const searchResult = await client.manager.search({
            query: song,
            requester: interaction.user.id,
        });

        // Step 6: Handle the search results.
        if (!searchResult.tracks.length) {
            return interaction.editReply('No results found for your query.');
        }
        switch (searchResult.loadType) {
            case 'search':
            case 'track':
                player.queue.add(searchResult.tracks[0]);

                if (!player.playing) {
                    player.play();
                }
                break;

            case 'empty':
                await interaction.editReply('No matches found for your query!');
                break;

            case 'error':
                await interaction.editReply(`An error occurred while loading the track: ${searchResult.error || 'Unknown error'}`);
                break;
        }
    }
    await interaction.editReply({
        content: `Added generated playlist to the queue.`,
    });
}

export default {
    data: data,
    execute: execute,
};
