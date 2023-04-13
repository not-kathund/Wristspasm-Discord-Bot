const minecraftCommand = require("../../contracts/minecraftCommand.js");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class warpoutCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "warpout";
    this.aliases = ["warp"];
    this.description = "Warp player out of the game";
    this.options = [];

    this.isOnCooldown = false;
  }

  async onCommand(username, message) {
    try {
      if (this.isOnCooldown) {
        return this.send(`/gc ${username} Command is on cooldown`);
      }

      this.isOnCooldown = true;

      const user = this.getArgs(message)[0];
      // eslint-disable-next-line no-throw-literal
      if (user === undefined) throw "Please provide a username!";
      bot.chat("/lobby megawalls")
      await delay(250);
      this.send("/play skyblock")
      

      const warpoutListener = async (message) => {
        message = message.toString();
        console.log(message)

        if (message.includes("You cannot invite that player since they're not online.")) {
          this.send(`/gc ${user} is not online!`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
        }

        else if (message.includes("You cannot invite that player!")) {
          this.send(`/gc ${user} has party requests disabled!`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;
        }

        else if (message.includes("invited") &&message.includes("to the party! They have 60 seconds to accept.")) {
          this.send(`/gc Succesfully invited ${user} to the party!`);
        }

        else if (message.includes(" joined the party.")) {
          this.send(`/gc ${user} joined the party! Warping them out of the game..`);
          this.send("/p warp");
        }

        else if (message.includes("warped to your server")) {
          this.send(`/gc ${user} warped out of the game! Disbanding party..`);
          this.send("/p disband");
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          await delay(1500);
          this.send("\u00a7");
        }

        else if (message.includes(" is not allowed on your server!")) {
          this.send(`/gc ${user} is not allowed on my server! Disbanding party..`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send("/p leave");
          await delay(1500);
          this.send("\u00a7");
        }

        else if (message.includes("You are not allowed to invite players.")) {
          this.send(`/gc Somehow I'm not allowed to invite players? Disbanding party..`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send("/p disband");
          await delay(1500);
          this.send("\u00a7");
        }

        else if (message.includes("You are not allowed to disband this party.")) {
          this.send(`/gc Somehow I'm not allowed to disband this party? Leaving party..`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send("/p leave");
          await delay(1500);
          this.send("\u00a7");
        }

        else if (message.includes("You can't party warp into limbo!")) {
          this.send(`/gc Somehow I'm isnide in limbo? Disbanding party..`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send("/p disband");
        }

        else if (message.includes("Couldn't find a player with that name!")) {
          this.send(`/gc Couldn't find a player with that name!`);
          bot.removeListener("message", warpoutListener);
          this.isOnCooldown = false;

          this.send("/p disband");
        }
      };

      bot.on("message", warpoutListener);
      this.send(`/p ${user} `);

      setTimeout(() => {
        bot.removeListener("message", warpoutListener);

        if (this.isOnCooldown === true) {
          this.send("/gc Party timedout");
          this.send("/p disband");
          this.send("\u00a7")

          this.isOnCooldown = false;
        }
      }, 30000);
    } catch (error) {
      this.send(`/gc ${username} Error: ${error || "Something went wrong.."}`);

      this.isOnCooldown = false;
    }
  }
}

module.exports = warpoutCommand;
