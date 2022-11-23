require("dotenv").config();

const steamUser = require("steam-user");
const totp = require("steam-totp");

var client = new steamUser();

client.logOn({
  accountName: process.env.STEAM_USERNAME,
  password: process.env.STEAM_PASSWORD,
  twoFactorCode: totp.generateAuthCode(process.env.STEAM_SHARED_SECRET),
});

client.on("loggedOn", (details) => {
  console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID());
  client.setPersona(steamUser.EPersonaState.Online);
  client.gamesPlayed([730, 40990, 728880, 410340]);
});

client.on("playingState", (blocked) => {
  console.log("Blocked: " + blocked);
  if (blocked) {
    setTimeout(() => {
      process.exit(0);
    }, 60 * 1000);
  }
});

client.on("error", (err) => {
  console.error(err);
  if (err.eresult == steamUser.EResult.LoggedInElsewhere) {
    process.exit(0);
  }
});
