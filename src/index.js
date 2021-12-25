const { Client, Intents, Permissions } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection, entersState, VoiceConnectionStatus, EndBehaviorType } = require("@discordjs/voice");
const prism = require("prism-media");
const fs = require("fs");
const { pipeline } = require("stream")

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const NOTrecordable = new Set();

require("dotenv").config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.user.setPresence({
    activities: [{ name: "/start", type: "LISTENING" }],
  });
});

client.on("interactionCreate", async (i) => {
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
      } else {
        await i.followUp("ボイスチャンネルに参加してからコマンドを実行してください。");
      }
    };

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20000);
      const receiver = connection.receiver;
      
      receiver.speaking.on('start', (userId) => {
        if (!NOTrecordable.has(userId)) {
          const opusStream = receiver.subscribe(userId, {
            end: {
              behavior: EndBehaviorType.AfterSilence,
              duration: 100
            }
          });
          const oggStream = new prism.opus.OggLogicalBitstream({
            opusHead: new prism.opus.OpusHead({
              channelCount: 2,
              sampleRate: 48000
            }),
            pageSizeControl: {
              maxPackets: 10
            }
          });

          const fileName = `./output/${Date.now()}-${client.users.cache.get(userId).tag}.ogg`

          const output = fs.createWriteStream(fileName);

          console.log("👂 録音中です");

          pipeline(opusStream, oggStream, out, (err) => {
            if (err) return console.error(`Error: ${err.toString()}`);
            console.info("録音に成功しました。");
          })
        }
      })
    } catch (err) {
      console.error(err);
      await i.followUp("ボイスチャンネルに参加することができませんでした。");
    }
  }
});
