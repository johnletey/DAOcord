require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()

const Arweave = require("arweave")
const Community = require('community-js').default

client.on("ready", async () => {
  console.log(`[discord] Logged in as ${client.user.tag}!`)

  let community = new Community(new Arweave({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
  }));

  await community.setCommunityTx(process.env.COMMUNITY);

  let votes = (await community.getState()).votes
  console.log(votes)
})

client.login(process.env.BOT_TOKEN)
