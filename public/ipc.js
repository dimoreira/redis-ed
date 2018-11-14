const { ipcMain, shell } = require("electron");
const redis = require("redis");
const UUID = require("uuid");

const createRedisInstance = (options) => {
  const uuid = UUID.v4();

  redisInstances[uuid] = redis.createClient(options);
  return uuid;
};

let redisInstances = [];

module.exports = {
  register: (mainWindow) => {
    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });

    ipcMain.on("load-page", (event, arg) => {
      mainWindow.loadURL(arg);
    });

    ipcMain.on("redis-command", (event, message) => {
      if (message.command === "createClient") {
        const uuid = createRedisInstance(message.args[0]);
        event.returnValue = { uuid: uuid };

        console.log(`MAIN - Created Redis Instance ${ uuid }`);
      } else {
        console.log(`MAIN - Received command ${ message.command } (${ message.queue }) for instance ${ message.uuid }`);

        const instance = redisInstances[message.uuid];
        const callback = (error, result) => {
          console.log(`MAIN - Command executed ${ message.command } (${ message.queue })`);

          event.sender.send("redis-command", {
            uuid: message.uuid,
            command: message.command,
            error: error,
            queue: message.queue,
            result: result,
          });
        };

        instance[message.command].apply(instance, [ ...message.args, callback]);
      }
    });
  }
};
