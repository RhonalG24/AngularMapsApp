const { mkdirSync, writeFileSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environments.ts';
const targetPathProd = './src/environments/environments.prod.ts';

const envFileContent = `
export const environment = {
  production: false,
  apiKey: "${process.env['MAPBOX_KEY']}",
};
`;

const prodEnvFileContent = `
export const environment = {
  production: true,
  apiKey: "${process.env['MAPBOX_KEY']}",
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync( targetPath, envFileContent );
writeFileSync( targetPathProd, prodEnvFileContent );
