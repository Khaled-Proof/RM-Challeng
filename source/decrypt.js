// in this approach i tried not to use archiver i was able to generate the secret.zip but it was 6.44 GB
//RangeError [ERR_FS_FILE_TOO_LARGE]: File size (6442516480) is greater than 2 GiB
//     at new NodeError (node:internal/errors:399:5)
//     at FSReqCallback.readFileAfterStat [as oncomplete] (node:fs:332:11) {
//   code: 'ERR_FS_FILE_TOO_LARGE'
// }

const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { promisify } = require('util');
const { join } = require('path');


const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const key = fs.readFileSync('secret.key').slice(0,32).toString('utf8');
const iv = fs.readFileSync('iv.txt');
const authTag = fs.readFileSync('auth.txt');
const cipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
cipher.setAuthTag(authTag);

const input = fs.createReadStream('secret.enc');
const unzip = zlib.createGunzip();
const output = fs.createWriteStream('secret.zip');

input.pipe(cipher).pipe(unzip).pipe(output);

output.on('finish', async () => {
    const data = await readFileAsync('secret.zip');

    const unzipped = await new Promise((resolve, reject) => {
        zlib.unzip(data, (err, buffer) => {
            if (err) reject(err);
            else resolve(buffer);
        });
    });

    console.log(`Uncompressed size: ${unzipped.length} bytes`);
    //Do something with the file

    await Promise.all([
        writeFileAsync('secret.zip', ''), // Empty file
    ]);
});



