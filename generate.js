require("dotenv").config();
const readlineSync = require('readline-sync')
const Web3 = require('web3');
const web3 = new Web3(process.env.PROVIDER);

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const walletName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors],
  length: 2
})+".json";

const fs = require('fs');
!fs.existsSync("wallets") && fs.mkdirSync("wallets");

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync("./wallets/"+walletName)
const db = low(adapter)

const pass = readlineSync.question('Password: ', {hideEchoBack: true});
web3.eth.accounts.wallet.create(1, web3.utils.randomHex(32));
const encrypted = web3.eth.accounts.wallet.encrypt(pass);
db.set("wallet", encrypted).write()

const encryptedWallet = db.get("wallet").value()
const passCheck = readlineSync.question('Password again: ', {hideEchoBack: true});
try {
  const decrypted = web3.eth.accounts.wallet.decrypt(encryptedWallet,passCheck);
  console.log(walletName+" wallet done");
} catch (e) {
  console.log("Wrong password");
}
