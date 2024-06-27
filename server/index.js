const express = require("express");
const {secp256k1} = require("ethereum-cryptography/secp256k1");
const app = express();
const cors = require("cors");
const {toHex, hexToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

//sample private keys are written next to line as comment
const balances = {
  "353ab0aedc3b5710e333ddc818e24625e49e09e4": 100, // 07a65fd525e1922fa92a06f7ee5e440aa90a49a2b8692308e9b2b20ee6971aef
  "a870d9db85595cfc051293a1964ae31c1094257f": 50, //  d91c459ec9e6edb8e4f66c9a61d97eb20ffe7ba03e2775373e57a5a79bc60652
  "9c812ae09c155e71174891d00fe5031c2737a018": 75, //  6ccdf98a5743289a787fe015cca04058f7d8885dab8b2b20aea5b503066def57
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signatureHex } = req.body;

  const rawRequest = {
    receiver: recipient,
    amount: amount.toString(),
  }
  var signature =  secp256k1.Signature.fromDER(signatureHex).addRecoveryBit(0);
  var requestHex = toHex(Buffer.from(JSON.stringify(rawRequest)));
  var senderPublicKey = signature.recoverPublicKey(requestHex).toRawBytes();
  var sender = toHex(keccak256(senderPublicKey.slice(1)).slice(-20));
  var senderPublicKeyHex = toHex(senderPublicKey);
  var verificationResult = secp256k1.verify(signature,requestHex,senderPublicKeyHex);
  if(verificationResult){
    setInitialBalance(sender);
    setInitialBalance(recipient);



    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else{
    res.status(400).send({ message: "Signature is not valid!" });
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
