const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

if (process.argv.length !== 5) {
    console.error('There should be 3 arguements to run!');
    process.exit(1);
}

const privateKey = hexToBytes(process.argv[2]);
const receiverAddress = process.argv[3];
const amount = process.argv[4];

const message = {
    receiver: receiverAddress,
    amount: amount,
}

const signature = secp256k1.sign(toHex(Buffer.from(JSON.stringify(message))),privateKey);

console.log('signature:', signature.toDERHex());

