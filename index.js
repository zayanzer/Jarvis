const { client, config } = require("./lib/");

const databaseSync = async () => {
  try {
    await DATABASE.authenticate({ retry: { max: 3 } });
    await config.DATABASE.sync();
  } catch (error) {
    console.log(`Unable to connect to the database\nerror: ${error.message}`);
    process.exit(1);
  }
};

const start = async () => {
    try {
        await databaseSync();
        const Client = new client();
        Client.log("starting client...");
        await Client.startServer();
        await Client.WriteSession();
        await Client.WaConnect();
    } catch (error) {
        console.error(error);
    }
};

start();
