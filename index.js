require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const Arweave = require("arweave");
const { getContract } = require("cacheweave");

let cachedLength = 0;
let firstRun = true;

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

client.on("ready", async () => {
  const channel = client.channels.cache.find(
    (channel) => channel.name === process.env.CHANNEL
  );

  setInterval(async () => await checkVotes(channel), 1000);
});

async function checkVotes(channel) {
  const state = await getContract(arweave, process.env.COMMUNITY);
  let votes = state.votes;

  if (firstRun) {
    cachedLength = votes.length;
    firstRun = false;
  }

  if (votes.length > cachedLength) {
    for (let i = cachedLength; i < votes.length; i++) {
      const vote = votes[i];
      await channel.send(
        new Discord.MessageEmbed()
          .setTitle(":pencil:  New Vote Proposal!")
          .setURL("https://community.xyz/#" + process.env.COMMUNITY + "/votes")
          .setAuthor(`${state.name} Community DAO`)
          .setThumbnail(
            "https://pbs.twimg.com/profile_images/1309140050429575169/IVkspquc_400x400.jpg"
          )
          .addFields(
            {
              name: "Memo",
              value: vote.note,
            },
            {
              name: "Type",
              value: vote.type,
            }
          )
          .setTimestamp()
          .setFooter(
            state.name,
            // TODO(@johnletey): Grab Community logo from cXYZ
            process.env.COMMUNITY_IMG
          )
      );
    }
    cachedLength = votes.length;
  }
}

client.login(process.env.BOT_TOKEN);
