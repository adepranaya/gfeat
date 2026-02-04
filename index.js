#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import fg from 'fast-glob';
import { pathToFileURL } from 'url';

import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from './utils/caseConversion.js';

import {
  loadUserConfig,
  getFeatureName,
  getSelectedTemplates,
} from './utils/functions.js';

export async function main() {
  try {
    const config = await loadUserConfig();
    const replaceStr = config?.replaceStr || 'BaseFeat';

    const featureName = await getFeatureName();
    const selectedTemplates = await getSelectedTemplates(config.templates);

    const pascalFeature = toPascalCase(featureName);
    const kebabFeature = toKebabCase(featureName);
    const camelFeature = toCamelCase(featureName);
    const snakeFeature = toSnakeCase(featureName);

    // change text to feature name
    function replaceAllCases(text) {
      return text
        .replace(new RegExp(replaceStr, 'g'), pascalFeature)
        .replace(new RegExp(toKebabCase(replaceStr), 'g'), kebabFeature)
        .replace(new RegExp(toCamelCase(replaceStr), 'g'), camelFeature)
        .replace(new RegExp(toSnakeCase(replaceStr), 'g'), snakeFeature);
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
              .replace('$CAMEL_FEAT', camelFeature)
              .replace('$SNAKE_FEAT', snakeFeature);

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

    for (const templateType of selectedTemplates) {
      await processTemplate(templateType);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(console.error);
}
