#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import fg from 'fast-glob';
import { checkbox, input } from '@inquirer/prompts';
import { pathToFileURL } from 'url';

// Global Variable
let pascalFeature = '';
let kebabFeature = '';
let camelFeature = '';

// Helper functions for case conversions
const toPascalCase = (str) =>
  str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());

const toKebabCase = (str) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const toCamelCase = (str) =>
  str
    .replace(/(?:[-_])([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^([A-Z])/, (_, c) => c.toLowerCase());

// Search file config from current project
async function loadUserConfig() {
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
const config = await loadUserConfig();
const replaceStr = config?.replaceStr || 'BaseFeat';

async function getFeatureName() {
  try {
    return await input({ message: 'Input Feature Name:' });
  } catch (error) {
    if (error.isTtyError || error.message.includes('User force closed')) {
      console.log('\nProcess interrupted by user. Exiting...');
      process.exit(0);
    }
    throw error;
  }
}

async function getSelectedTemplates() {
  try {
    return await checkbox({
      message: 'Choose templates:',
      choices: config.templates.map((t) => ({ name: t.name, value: t })),
    });
  } catch (error) {
    if (error.isTtyError || error.message.includes('User force closed')) {
      console.log('\nProcess interrupted by user. Exiting...');
      process.exit(0);
    }
    throw error;
  }
}

// change text to feature name
function replaceAllCases(text) {
  return text
    .replace(new RegExp(replaceStr, 'g'), pascalFeature)
    .replace(new RegExp(toKebabCase(replaceStr), 'g'), kebabFeature)
    .replace(new RegExp(toCamelCase(replaceStr), 'g'), camelFeature);
}

async function processTemplate(templateType) {
  for (const srcPath of templateType.src) {
    const files = await fg(path.resolve(srcPath));
    for (const srcFilePath of files) {
      const file = path.basename(srcFilePath);
      const fileName = replaceAllCases(file);

      for (const target of templateType.target) {
        const targetDir = target
          .replace('$PASCAL_FEAT', pascalFeature)
          .replace('$KEBAB_FEAT', kebabFeature)
          .replace('$CAMEL_FEAT', camelFeature);

        const targetFilePath = path.join(targetDir, fileName);

        await fs.ensureDir(targetDir);
        let content = await fs.readFile(srcFilePath, 'utf8');
        content = replaceAllCases(content);

        await fs.writeFile(targetFilePath, content);
        console.log(`File created: ${targetFilePath}`);
      }
    }
  }
}

async function main() {
  try {
    const featureName = await getFeatureName();
    const selectedTemplates = await getSelectedTemplates();

    pascalFeature = toPascalCase(featureName);
    kebabFeature = toKebabCase(featureName);
    camelFeature = toCamelCase(featureName);

    for (const templateType of selectedTemplates) {
      await processTemplate(templateType);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
