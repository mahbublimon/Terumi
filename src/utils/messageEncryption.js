const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = process.env.MESSAGE_SECRET || 'message-secret-key';

function encryptMessage(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  const encryptedMessage = Buffer.concat([cipher.update(message), cipher.final()]);
  
  return iv.toString('hex') + ':' + encryptedMessage.toString('hex');
}

function decryptMessage(encryptedMessage) {
  const [iv, content] = encryptedMessage.split(':');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
  
  return decrypted.toString();
}

module.exports = { encryptMessage, decryptMessage };
