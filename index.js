require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const Arweave = require("arweave");
const Community = require("community-js").default;

client.on("ready", async () => {
  console.log(`[discord] Logged in as ${client.user.tag}!`);

  const channel = client.channels.cache.find(
    (channel) => channel.name === process.env.CHANNEL
  );

  let community = new Community(
    new Arweave({
      host: "arweave.net",
      port: 443,
      protocol: "https",
      timeout: 20000,
    })
  );

  await community.setCommunityTx(process.env.COMMUNITY);

  let votes = (await community.getState()).votes;
  channel.send("```\n" + JSON.stringify(votes, null, 2) + "\n```");
});

client.login(process.env.BOT_TOKEN);
