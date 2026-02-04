import { describe, it, mock, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import esmock from 'esmock';

describe('Functions Test', () => {
  let tmpDir;
  let originalCwd;

  before(async () => {
    originalCwd = process.cwd();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gfeat-test-'));
  });

  after(async () => {
    if (process.cwd() !== originalCwd) {
      process.chdir(originalCwd);
    }
    await fs.remove(tmpDir);
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  it('should get feature name', async () => {
    const mockInput = mock.fn(async () => 'Ade Pranaya');

    const { getFeatureName } = await esmock('../utils/functions.js', {
      '@inquirer/prompts': {
        input: mockInput,
        checkbox: async () => [],
      },
    });

    const result = await getFeatureName();
    assert.strictEqual(result, 'Ade Pranaya');
    assert.strictEqual(mockInput.mock.calls.length, 1);
  });

  it('should get selected templates', async () => {
    const mockCheckbox = mock.fn(async () => ['Template A']);

    const { getSelectedTemplates } = await esmock('../utils/functions.js', {
      '@inquirer/prompts': {
        input: async () => '',
        checkbox: mockCheckbox,
      },
    });

    const templates = [
      { name: 'Template A', value: 'A' },
      { name: 'Template B', value: 'B' },
    ];
    const result = await getSelectedTemplates(templates);

    assert.deepStrictEqual(result, ['Template A']);
    assert.strictEqual(mockCheckbox.mock.calls.length, 1);

    const calls = mockCheckbox.mock.calls[0];
    assert.strictEqual(calls.arguments[0].choices.length, 2);
  });

  it('should handle user interrupt in getFeatureName', async () => {
    const mockExit = mock.method(process, 'exit', () => {});
    const mockConsoleLog = mock.method(console, 'log', () => {});

    const error = new Error('User force closed');
    error.isTtyError = true;
    const mockInput = mock.fn(async () => {
      throw error;
    });

    const { getFeatureName } = await esmock('../utils/functions.js', {
      '@inquirer/prompts': {
        input: mockInput,
        checkbox: async () => [],
      },
    });

    await getFeatureName();

    assert.strictEqual(mockExit.mock.calls.length, 1);
    assert.strictEqual(mockExit.mock.calls[0].arguments[0], 0);
  });

  it('should load user config (gfeat.config.js)', async () => {
    const configPath = path.join(tmpDir, 'gfeat.config.js');
    const configContent = 'export default { replaceStr: "TestFeat" };';
    await fs.writeFile(configPath, configContent);

    process.chdir(tmpDir);

    const { loadUserConfig } = await esmock('../utils/functions.js');

    const config = await loadUserConfig();
    assert.strictEqual(config.replaceStr, 'TestFeat');
  });

  it('should exit if config file not found', async () => {
    process.chdir(tmpDir);
    const files = [
      'gfeat.config.js',
      'gfeat.config.ts',
      'gfeat.config.mjs',
      'gfeat.config.cjs',
    ];
    for (const file of files) {
      if (await fs.pathExists(path.join(tmpDir, file))) {
        await fs.remove(path.join(tmpDir, file));
      }
    }

    const mockExit = mock.method(process, 'exit', () => {});
    const mockConsoleError = mock.method(console, 'error', () => {});

    const { loadUserConfig } = await esmock('../utils/functions.js');

    await loadUserConfig();

    assert.strictEqual(mockExit.mock.calls.length, 1);
    assert.strictEqual(mockExit.mock.calls[0].arguments[0], 1);
  });
});
