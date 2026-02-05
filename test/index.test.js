import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import esmock from 'esmock';

describe('Index Test', () => {
  beforeEach(() => {
    mock.restoreAll();
  });

  it('should generate files correctly', async () => {
    const mockEnsureDir = mock.fn(async () => {});
    const mockReadFile = mock.fn(async () => 'Content BaseFeat');
    const mockWriteFile = mock.fn(async () => {});
    const mockFg = mock.fn(async () => ['/src/BaseFeat.js']);

    const mockLoadUserConfig = mock.fn(async () => ({
      replaceStr: 'BaseFeat',
      templates: [
        {
          name: 'T1',
          src: ['./templates'],
          target: ['./output/$PASCAL_FEAT'],
        },
      ],
    }));
    const mockGetFeatureName = mock.fn(async () => 'MyFeature');
    const mockGetSelectedTemplates = mock.fn(async (templates) => templates);

    const { main } = await esmock('../index.js', {
      'fs-extra': {
        default: {
          ensureDir: mockEnsureDir,
          readFile: mockReadFile,
          writeFile: mockWriteFile,
          existsSync: () => true,
        },
        ensureDir: mockEnsureDir,
        readFile: mockReadFile,
        writeFile: mockWriteFile,
        existsSync: () => true,
      },
      'fast-glob': {
        default: mockFg,
      },
      '../utils/functions.js': {
        loadUserConfig: mockLoadUserConfig,
        getFeatureName: mockGetFeatureName,
        getSelectedTemplates: mockGetSelectedTemplates,
      },
    });

    mock.method(console, 'log', () => {});

    await main();

    assert.strictEqual(mockWriteFile.mock.calls.length, 1);

    const targetPath = mockWriteFile.mock.calls[0].arguments[0];
    assert.ok(
      targetPath.includes('MyFeature') && targetPath.endsWith('.js'),
      `Unexpected target path: ${targetPath}`
    );

    const content = mockWriteFile.mock.calls[0].arguments[1];
    assert.strictEqual(content, 'Content MyFeature');
  });
});
