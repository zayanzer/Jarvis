const { client, config } = require("./lib/");
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
const start = async () => {
    try {
    try {
        await config.DATABASE.sync();
        await databaseSync();
        const Client = new client();
        const Client = new client();
        Client.log("starting client...");
        Client.log("starting client...");
        await Client.startServer();
