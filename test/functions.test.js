import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getFeatureName } from '../utils/functions.js';
// import inquirer from '@inquirer/prompts';

describe('Functions Test', () => {
  it('should be show feature name', async () => {
    // Mock input untuk prompt
    // mock.method(inquirer, 'input', async () => 'Mocked Input');
    // const result = await inquirer.input({ message: 'Enter something:' });
    const result = await getFeatureName();

    const expected = 'Ade Pranaya';
    assert.strictEqual(result, expected);
  });
});
