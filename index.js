require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const Arweave = require("arweave");
const Community = require("community-js").default;

client.on("ready", async () => {
  console.log(`[discord] Logged in as ${client.user.tag}!`);

  let cachedLength = 0;

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

  setInterval(async () => await checkVotes(community, cachedLength, channel), 1000 * 60);
});

async function checkVotes(community, cachedLength, channel) {
  let votes = (await community.getState()).votes;
  console.log(votes);

  if (votes.length > cachedLength) {
    for (let i = cachedLength; i < votes.length; i++) {
      const vote = votes[i];
      await channel.send(
        new Discord.MessageEmbed()
          .setTitle(":pencil:  New Vote!")
          .setDescription(vote.note)
      );
    }
    cachedLength = votes.length;
  }
}

client.login(process.env.BOT_TOKEN);
