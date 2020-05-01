const tunnel = require("tunnel-ssh");
MongoClient = module.exports = require("mongodb").MongoClient;
let config = require("./config.json");

const sshTunnelConfig = {
  //   agent: process.env.SSH_AUTH_SOCK,
  username: config.sshUser,
  password: config.sshPassword,
  //   privateKey: require("fs").readFileSync("./id_rsa.ppk"),
  host: config.sshHost, //IP adress of VPS which is the SSH server
  port: 22,
  dstHost: config.dbHost, // database ip
  dstPort: 27017, //or 27017 or something like that
  localHost: "127.0.0.1", // do not change
  localPort: 1337, // do not change or anything else unused you want
};

mongoConnect = async () => {
  return new Promise((resolve, reject) => {
    const uri = `mongodb://${config.dbUser}:${config.dbPassword}@127.0.0.1:1337/${config.dbName}`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect(async (err) => {
      if (err) {
        console.trace(err);
      } else {
        db = module.exports = client.db(config.dbName);
        console.log("connected to database");
      }

      // perform actions on the collection object
      resolve();
    });
  });
};

tunnel(sshTunnelConfig, async (error, server) => {
  if (error) {
    console.log("SSH connection error: ", error);
  } else {
    console.log("Ssh tunnel connected....");
    await mongoConnect();
  }
});
