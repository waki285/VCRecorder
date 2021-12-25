const { Client, Intents, Permissions } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const recordable = new Set();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.user.setPresence({
    activities: [{ name: "/start", type: "LISTENING" }],
  });
});

client.on("interactionCreate", (i) => {
  if (!i.isCommand()) return;
  const { commandName: command } = i;
  if (command === "start") {
    await i.deferReply();
    let connection = getVoiceConnection(i.guildId);
    if (!connection) {
      if (i.member.voice.channel) {
        const channel = i.member.voice.channel;
        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          selfDeaf: false,
          selfMute: true,
          adapterCreator: channel.guild.voiceAdapterCreator
        })
      }
    }
  }
});
