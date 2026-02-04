import fs from 'fs-extra';
import path from 'path';
import { pathToFileURL } from 'url';
import { checkbox, input } from '@inquirer/prompts';

// Search file config from current project
export async function loadUserConfig() {
  const configFiles = [
    'gfeat.config.js',
    'gfeat.config.ts',
    'gfeat.config.mjs',
    'gfeat.config.cjs',
  ];

  for (const file of configFiles) {
    const configPath = path.resolve(process.cwd(), file);

    if (fs.existsSync(configPath)) {
      let config;
      if (file.endsWith('.cjs')) {
        config = require(configPath); // Gunakan require untuk CommonJS
      } else {
        config = await import(pathToFileURL(configPath).href); // Gunakan import untuk ESModule
      }
      return config.default ?? config;
    }
  }

  console.error(
    'Config file not found! Please create `gfeat.config.js`, `.ts`, `.mjs`, or `.cjs` in your project.'
  );
  process.exit(1);
}

export async function getFeatureName() {
  try {
    return await input({ message: 'Input Feature Name:' });
  } catch (error) {
    if (error.isTtyError || error.message.includes('User force closed')) {
      console.log('\nProcess interrupted by user. Exiting...');
      process.exit(0);
      return;
    }
    throw error;
  }
}

export async function getSelectedTemplates(templates) {
  try {
    return await checkbox({
      message: 'Choose templates:',
      choices: templates?.map((t) => ({ name: t.name, value: t })),
    });
  } catch (error) {
    if (error.isTtyError || error.message.includes('User force closed')) {
      console.log('\nProcess interrupted by user. Exiting...');
      process.exit(0);
      return;
    }
    throw error;
  }
}
