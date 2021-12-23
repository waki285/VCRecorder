const { Client, Intents, Permissions } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.user.setPresence({
    activities: [{ name: "/start", type: "LISTENING" }],
  });
});

client.on("interactionCreate", (i) => {
  const { commandName: command } = i;
  if (command === "start") {
    
  }
});
