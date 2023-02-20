// hier i used archiver. able to generate the zip file but did not have time to continute
//producing this error
//node:events:490
//       throw er; // Unhandled 'error' event
//       ^
//
// Error: incorrect header check
//     at Zlib.zlibOnError [as onerror] (node:zlib:189:17)
// Emitted 'error' event on Gunzip instance at:
//     at Gunzip.onerror (node:internal/streams/readable:785:14)
//     at Gunzip.emit (node:events:512:28)
//     at emitErrorNT (node:internal/streams/destroy:151:8)
//     at emitErrorCloseNT (node:internal/streams/destroy:116:3)
//     at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
//   errno: -3,
//   code: 'Z_DATA_ERROR'


const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const archiver = require('archiver');

// Read the key, iv, and auth from their respective files
const key = fs.readFileSync('secret.key').slice(0,32).toString('utf8');
const iv = fs.readFileSync('iv.txt');
const auth = fs.readFileSync('auth.txt');


const unzip = zlib.createGunzip();
const outputStream = fs.createWriteStream('unzipped.txt');

// Read the encrypted file
const encryptedData = fs.readFileSync('secret.enc');

// Decrypt the file using the key, iv, and auth
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(auth);
let decryptedData = decipher.update(encryptedData);
decryptedData = Buffer.concat([decryptedData, decipher.final()]);

// Compress the decrypted data using zlib
const compressedData = zlib.gzipSync(decryptedData);

// Create a new zip file and add the compressed data to it
const zipFilename = 'secret.zip';
const output = fs.createWriteStream(zipFilename);
const archive = archiver('zip', {
    zlib: { level: 9 } // maximum compression
});

output.on('close', function() {
    console.log(`Zip file ${zipFilename} created successfully.`);
    const readStream = fs.createReadStream('secret.zip');
    readStream.pipe(zlib.createGunzip()).pipe(outputStream);

});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);
//archive.append(compressedData, { name: 'secret.txt.gz' });
archive.finalize();





