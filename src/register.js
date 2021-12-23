const { Client, ClientApplication } = require("discord.js");

const commands = [
  {
    name: "start",
    description: "録音を開始します。",
  },
  {
    name: "stop",
    description: "録音を停止し、ファイルを出力します。",
  },
];

(async () => {
  const client = new Client({ intents: 0 });
  client.token = process.env.BOT_TOKEN;
  client.application = new ClientApplication(client, {});
  await client.application.fetch();

  await client.application.commands.set(commands, process.argv[2]);

  console.log("Registration Success.");
})();
