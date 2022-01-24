const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const SHA256 = require("crypto-js/sha256");

const EC = require("elliptic").ec;
var ec = new EC("secp256k1");

const key1 = ec.genKeyPair();
const key2 = ec.genKeyPair();
const key3 = ec.genKeyPair();

const publicKey1 = key1.getPublic().encode("hex");
const publicKey2 = key2.getPublic().encode("hex");
const publicKey3 = key3.getPublic().encode("hex");

const privKey1 = key1.getPrivate().toString(16);
const privKey2 = key2.getPrivate().toString(16);
const privKey3 = key3.getPrivate().toString(16);
// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const publicKeys = [SHA256(publicKey1), SHA256(publicKey2), SHA256(publicKey3)];

const balances = {};
balances[publicKey1] = 100;
balances[publicKey2] = 50;
balances[publicKey3] = 75;
const privKeys = {};
privKeys[1] = privKey1;
privKeys[2] = privKey2;
privKeys[3] = privKey3;
console.log(balances, privKeys);

secp.getPublicKey(privKeys);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
