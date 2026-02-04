import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  toSnakeCase,
  toPascalCase,
  toCamelCase,
  toKebabCase,
} from '../utils/caseConversion.js';

describe('caseConversion Functions', () => {
  it('toSnakeCase', () => {
    // Test Cases
    const testCases = [
      { input: 'HelloWorld', expected: 'hello_world' },
      { input: 'helloWorld', expected: 'hello_world' },
      { input: 'hello-world', expected: 'hello_world' },
      { input: 'hello_world', expected: 'hello_world' },
      { input: 'Hello World', expected: 'hello_world' },
      { input: 'HELLO WORLD', expected: 'hello_world' },
      { input: 'snake_case', expected: 'snake_case' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = toSnakeCase(input);
      assert.strictEqual(
        result,
        expected,
        `toSnakeCase("${input}") should return "${expected}"`
      );
    });
  });
  it('toPascalCase', () => {
    // Test Cases
    const testCases = [
      { input: 'HelloWorld', expected: 'HelloWorld' },
      { input: 'helloWorld', expected: 'HelloWorld' },
      { input: 'hello-world', expected: 'HelloWorld' },
      { input: 'hello_world', expected: 'HelloWorld' },
      { input: 'Hello World', expected: 'HelloWorld' },
      { input: 'HELLO WORLD', expected: 'HelloWorld' },
      { input: 'snake_case', expected: 'SnakeCase' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = toPascalCase(input);
      assert.strictEqual(
        result,
        expected,
        `toPascalCase("${input}") should return "${expected}"`
      );
    });
  });
  it('toCamelCase', () => {
    // Test Cases
    const testCases = [
      { input: 'HelloWorld', expected: 'helloWorld' },
      { input: 'helloWorld', expected: 'helloWorld' },
      { input: 'hello-world', expected: 'helloWorld' },
      { input: 'hello_world', expected: 'helloWorld' },
      { input: 'Hello World', expected: 'helloWorld' },
      { input: 'HELLO WORLD', expected: 'helloWorld' },
      { input: 'snake_case', expected: 'snakeCase' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = toCamelCase(input);
      assert.strictEqual(
        result,
        expected,
        `toCamelCase("${input}") should return "${expected}"`
      );
    });
  });
  it('toKebabCase', () => {
    // Test Cases
    const testCases = [
      { input: 'HelloWorld', expected: 'hello-world' },
      { input: 'helloWorld', expected: 'hello-world' },
      { input: 'hello-world', expected: 'hello-world' },
      { input: 'hello_world', expected: 'hello-world' },
      { input: 'Hello World', expected: 'hello-world' },
      { input: 'HELLO WORLD', expected: 'hello-world' },
      { input: 'snake_case', expected: 'snake-case' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = toKebabCase(input);
      assert.strictEqual(
        result,
        expected,
        `toKebabCase("${input}") should return "${expected}"`
      );
    });
  });
});
