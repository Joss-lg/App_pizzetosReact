/**
 * Descarga el JAR de DynamoDB Local desde la URL oficial de AWS CloudFront.
 * Solo descarga si el JAR no existe todavía en .dynamodb/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DYNAMO_DIR = path.join(__dirname, '..', '.dynamodb');
const DYNAMO_JAR = path.join(DYNAMO_DIR, 'DynamoDBLocal.jar');
const TARBALL_URL =
  'https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz';
const TARBALL_PATH = path.join(DYNAMO_DIR, 'dynamodb_local.tar.gz');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = (u) => {
      https
        .get(u, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return request(res.headers.location);
          }
          if (res.statusCode !== 200) {
            file.close();
            return reject(new Error(`HTTP ${res.statusCode} al descargar ${u}`));
          }
          let downloaded = 0;
          res.on('data', (chunk) => {
            downloaded += chunk.length;
            process.stdout.write(
              `\rDescargando... ${(downloaded / 1024 / 1024).toFixed(1)} MB`
            );
          });
          res.pipe(file);
          file.on('finish', () => {
            process.stdout.write('\n');
            file.close(resolve);
          });
        })
        .on('error', (err) => {
          file.close();
          reject(err);
        });
    };

    request(url);
  });
}

async function downloadDynamo() {
  if (fs.existsSync(DYNAMO_JAR)) {
    console.log('DynamoDB Local JAR ya existe, omitiendo descarga.');
    return;
  }

  fs.mkdirSync(DYNAMO_DIR, { recursive: true });
  console.log('Descargando DynamoDB Local desde AWS CloudFront...');
  await downloadFile(TARBALL_URL, TARBALL_PATH);

  console.log('Extrayendo archivos...');
  execSync(`tar -xzf "${TARBALL_PATH}" -C "${DYNAMO_DIR}"`);
  fs.unlinkSync(TARBALL_PATH);

  console.log('DynamoDB Local instalado en .dynamodb/\n');
}

module.exports = { downloadDynamo };

if (require.main === module) {
  downloadDynamo().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
