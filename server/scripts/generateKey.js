const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();
const privateKeyInHex = toHex(privateKey);
console.log('private key:', privateKeyInHex);
const publicKey = secp256k1.getPublicKey(privateKey);
var key = publicKey.slice(1);
var address = keccak256(key).slice(-20);
console.log('publicKey:', toHex(address));


