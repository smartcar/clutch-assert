'use strict';

const trimOffNewlines = require('trim-off-newlines');

const INDENT = '  ';
const indentLines = (string) =>
  trimOffNewlines(string)
    .split('\n')
    .map((line) => INDENT + line)
    .join('\n');

/* eslint-disable */

/**
 * Code pulled from AVA
 *
 * Modifications:
 * - changed import of chalk
 * - added indents
 *
 * Link: https://github.com/avajs/ava/blob/master/lib/reporters/format-serialized-error.js
 * Source: https://github.com/avajs/ava/blob/2e72fe7cf19a25f4d789356b9f38502ffb0091ba/lib/reporters/format-serialized-error.js
 */
const chalk = require('chalk');

/* istanbul ignore next */
function formatSerializedError(error) {
  error.statements = error.statements || [];
  error.values = error.values || [];

  const printMessage =
    error.values.length === 0
      ? Boolean(error.message)
      : !error.values[0].label.startsWith(error.message);

  if (error.statements.length === 0 && error.values.length === 0) {
    return {formatted: null, printMessage};
  }

  let formatted = '';
  for (const value of error.values) {
    formatted += indentLines(value.label) + '\n\n';
    formatted += indentLines(value.formatted) + '\n\n';
  }

  for (const statement of error.statements) {
    formatted += `${INDENT}${statement[0]}\n${chalk.grey('=>')} ${trimOffNewlines(
      statement[1]
    )}\n\n`;
  }

  formatted = trimOffNewlines(formatted);
  return {formatted, printMessage};
}

module.exports = formatSerializedError;
