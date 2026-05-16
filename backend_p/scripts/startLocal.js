/**
 * Orquestador local: descarga DynamoDB Local (si falta), lo inicia,
 * crea la tabla y luego levanta serverless-offline.
 * Uso: node scripts/startLocal.js  (o: npm run local)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const { downloadDynamo } = require('./downloadDynamo');
const { createTable } = require('./createTable');

const DYNAMO_JAR = path.join(__dirname, '..', '.dynamodb', 'DynamoDBLocal.jar');
const DYNAMO_LIB = path.join(__dirname, '..', '.dynamodb');

function waitForDynamo(retries = 40) {
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get('http://localhost:8000', () => resolve());
      req.on('error', () => {
        if (retries-- > 0) {
          setTimeout(check, 500);
        } else {
          reject(new Error('DynamoDB Local no respondió. ¿Está Java instalado? Ejecuta: java -version'));
        }
      });
      req.end();
    };
    setTimeout(check, 1500);
  });
}

async function main() {
  // 1. Descargar JAR si no existe
  await downloadDynamo();

  // 2. Iniciar DynamoDB Local
  console.log('Iniciando DynamoDB Local en puerto 8000...');
  const dynamo = spawn(
    'java',
    [
      `-Djava.library.path=${DYNAMO_LIB}`,
      '-jar', DYNAMO_JAR,
      '-inMemory',
      '-port', '8000',
    ],
    { stdio: 'inherit' }
  );

  dynamo.on('error', (err) => {
    console.error('\nError al iniciar DynamoDB Local:', err.message);
    console.error('Instala Java (Amazon Corretto 17): https://aws.amazon.com/corretto/');
    process.exit(1);
  });

  // 3. Esperar a que DynamoDB esté listo
  await waitForDynamo();
  console.log('DynamoDB Local listo en http://localhost:8000\n');

  // 4. Crear tabla
  await createTable();

  // 5. Iniciar serverless offline
  console.log('\nIniciando serverless offline...\n');
  const sls = spawn('npx', ['sls', 'offline', '--host', '0.0.0.0'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..'),
  });

  const shutdown = () => {
    dynamo.kill();
    sls.kill();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('\n' + err.message);
  process.exit(1);
});
