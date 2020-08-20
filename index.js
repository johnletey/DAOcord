require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const Arweave = require("arweave");
const Community = require("community-js").default;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

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

  while (true) {
    let votes = (await community.getState()).votes;

    if (votes.length > cachedLength) {
      for (let i = cachedLength; i < votes.length; i++) {
        const vote = votes[i];
        channel.send(
          new Discord.MessageEmbed()
            .setTitle(":new:  New Vote")
            .setDescription(vote.note)
        );
      }
      cachedLength = votes.length;
    }

    sleep(1000 * 60)
  }
});

client.login(process.env.BOT_TOKEN);
