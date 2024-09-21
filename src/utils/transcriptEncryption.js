const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY || 'your-secret-key'; // Use an environment variable for security

/**
 * Encrypts a given text.
 * @param {String} text - The plaintext to encrypt.
 * @returns {String} - The encrypted text.
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts a given encrypted text.
 * @param {String} text - The encrypted text to decrypt.
 * @returns {String} - The decrypted plaintext.
 */
function decrypt(text) {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));

  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);

  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
