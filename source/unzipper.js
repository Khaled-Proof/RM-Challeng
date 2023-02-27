//Using uziiper this will decrypt the file and will compresse it to 48,9 mb file. When decompress will create 6,44 GB file
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');
const unzipper = require('unzipper');

// Read the encrypted data from the file
const encryptedData = fs.readFileSync('secret.enc');

// Read the key from the file
const key = fs.readFileSync('secret.key').slice(0,32).toString('utf8');

// Read the initialization vector (IV) from the file
const iv = fs.readFileSync('iv.txt');

// Read the authentication tag from the file
const authTag = fs.readFileSync('auth.txt');

// Create a decipher object using the AES256-GCM algorithm, the key, and the IV
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

// Set the authentication tag on the decipher object
decipher.setAuthTag(authTag);

// Decrypt the data
const decrypted = decipher.update(encryptedData);
const plaintext = Buffer.concat([decrypted, decipher.final()]);

// Write the decrypted data to a ZIP file
fs.writeFileSync('secret.zip', plaintext);


// Unzip the contents of the ZIP file
//const zipFile = fs.createReadStream('secret.zip').pipe(zlib.createGunzip()).pipe(unzipper.Extract({ path: '.' }));
const zipFile = fs.createReadStream('secret.zip');
zipFile.pipe(unzipper.Extract({ path: '' }));



zipFile.on('close', () => {
    console.log('Done!');
});

