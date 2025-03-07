import fs from 'fs-extra';
import path from 'path';
import fg from 'fast-glob';
import { checkbox, input } from '@inquirer/prompts';

// Helper functions for case conversions
const toPascalCase = (str) => str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
const toKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toCamelCase = (str) => str.replace(/(?:[-_])([a-z])/g, (_, c) => c.toUpperCase()).replace(/^([A-Z])/, (_, c) => c.toLowerCase());


// Cari file config dari proyek pengguna
function loadUserConfig() {
  const configPaths = [
    path.resolve(process.cwd(), 'gfeat.config.js'), // Cek di root proyek
  ];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      return import(configPath);
    }
  }

  console.error('Config file not found! Please create `gfeat.config.js` in your project.');
  process.exit(1);
}
const config = await loadUserConfig();

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
      message: 'Pilih template:',
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

function generateFileName(file, pascalFeature, kebabFeature, camelFeature) {
  return file
    .replace('BasicComp', pascalFeature)
    .replace('basic-comp', kebabFeature)
    .replace('basicComp', camelFeature);
}

function replaceContent(content, pascalFeature, kebabFeature, camelFeature) {
  return content
    .replace(/BasicComp/g, pascalFeature)
    .replace(/basic-comp/g, `${kebabFeature}`)
    .replace(/basicComp/g, `${camelFeature}`);
}

async function processTemplate(templateType, pascalFeature, kebabFeature, camelFeature) {
  for (const srcPath of templateType.src) {
    const files = await fg(path.resolve(srcPath));
    for (const srcFilePath of files) {
      const file = path.basename(srcFilePath);
      const fileName = generateFileName(file, pascalFeature, kebabFeature, camelFeature);
      
      for (const target of templateType.target) {
        const targetDir = target.replace('$PARAM', pascalFeature);
        const targetFilePath = path.join(targetDir, fileName);

        await fs.ensureDir(targetDir);
        let content = await fs.readFile(srcFilePath, 'utf8');
        content = replaceContent(content, pascalFeature, kebabFeature, camelFeature);

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

    const pascalFeature = toPascalCase(featureName);
    const kebabFeature = toKebabCase(featureName);
    const camelFeature = toCamelCase(featureName);

    for (const templateType of selectedTemplates) {
      await processTemplate(templateType, pascalFeature, kebabFeature, camelFeature);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);