'use strict';

/* eslint-disable */

/**
 * Code pulled from AVA
 *
 * Modifications:
 * - deleted all functions expect for:
 *   - formatDescriptorWithLabel
 *   - formatWithLabel
 *   - hasOwnProperty
 *   - validateExpectations
 *   - assertExpectations
 *
 * - removed all require statements except:
 *   - concordance
 *   - isError
 *   - concordanceOptions
 *
 * - replace instances of "`t." with "`assert."
 *   - sed: "s/`t\./`assert\./"
 *
 *  - modified template strings in validateExpectations to replace
 *    references to "assertion" with "assertion.name"
 *   - sed: 's/\${assertion}/${assertion.name}/g'
 *
 * - added /* istanbul ignore next to:
 *   - validateExpectations
 *   - assertExpectations
 *
 * - replace exports with an object all function
 *
 * Link: https://github.com/avajs/ava/blob/master/lib/assert.js
 * Source: https://github.com/avajs/ava/blob/2e72fe7cf19a25f4d789356b9f38502ffb0091ba/lib/assert.js
 */

const concordance = require('concordance');
const isError = require('is-error');
const AssertionError = require('./assertion-error');
const concordanceOptions = require('./concordance-options').default;

function formatDescriptorWithLabel(label, descriptor) {
  return {
    label,
    formatted: concordance.formatDescriptor(descriptor, concordanceOptions),
  };
}

function formatWithLabel(label, value) {
  return formatDescriptorWithLabel(
    label,
    concordance.describe(value, concordanceOptions),
  );
}

const hasOwnProperty = (obj, prop) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

/* istanbul ignore next */
function validateExpectations(assertion, expectations, numArgs) {
  // eslint-disable-line complexity
  if (typeof expectations === 'function') {
    expectations = { instanceOf: expectations };
  } else if (
    typeof expectations === 'string' ||
    expectations instanceof RegExp
  ) {
    expectations = { message: expectations };
  } else if (numArgs === 1 || expectations === null) {
    expectations = {};
  } else if (
    typeof expectations !== 'object' ||
    Array.isArray(expectations) ||
    Object.keys(expectations).length === 0
  ) {
    throw new AssertionError({
      assertion,
      message: `The second argument to \`assert.${assertion.name}()\` must be a function, string, regular expression, expectation object or \`null\``,
      values: [formatWithLabel('Called with:', expectations)],
    });
  } else {
    if (
      hasOwnProperty(expectations, 'instanceOf') &&
      typeof expectations.instanceOf !== 'function'
    ) {
      throw new AssertionError({
        assertion,
        message: `The \`instanceOf\` property of the second argument to \`assert.${assertion.name}()\` must be a function`,
        values: [formatWithLabel('Called with:', expectations)],
      });
    }

    if (
      hasOwnProperty(expectations, 'message') &&
      typeof expectations.message !== 'string' &&
      !(expectations.message instanceof RegExp)
    ) {
      throw new AssertionError({
        assertion,
        message: `The \`message\` property of the second argument to \`assert.${assertion.name}()\` must be a string or regular expression`,
        values: [formatWithLabel('Called with:', expectations)],
      });
    }

    if (
      hasOwnProperty(expectations, 'name') &&
      typeof expectations.name !== 'string'
    ) {
      throw new AssertionError({
        assertion,
        message: `The \`name\` property of the second argument to \`assert.${assertion.name}()\` must be a string`,
        values: [formatWithLabel('Called with:', expectations)],
      });
    }

    if (
      hasOwnProperty(expectations, 'code') &&
      typeof expectations.code !== 'string' &&
      typeof expectations.code !== 'number'
    ) {
      throw new AssertionError({
        assertion,
        message: `The \`code\` property of the second argument to \`assert.${assertion.name}()\` must be a string or number`,
        values: [formatWithLabel('Called with:', expectations)],
      });
    }

    for (const key of Object.keys(expectations)) {
      switch (key) {
        case 'instanceOf':
        case 'is':
        case 'message':
        case 'name':
        case 'code':
          continue;
        default:
          throw new AssertionError({
            assertion,
            message: `The second argument to \`assert.${assertion.name}()\` contains unexpected properties`,
            values: [formatWithLabel('Called with:', expectations)],
          });
      }
    }
  }

  return expectations;
}

// Note: this function *must* throw exceptions, since it can be used
// as part of a pending assertion for promises.
/* istanbul ignore next */
function assertExpectations({
  assertion,
  actual,
  expectations,
  message,
  prefix,
  stack,
}) {
  if (!isError(actual)) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} exception that is not an error:`, actual),
      ],
    });
  }

  if (hasOwnProperty(expectations, 'is') && actual !== expectations.is) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected to be strictly equal to:', expectations.is),
      ],
    });
  }

  if (expectations.instanceOf && !(actual instanceof expectations.instanceOf)) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected instance of:', expectations.instanceOf),
      ],
    });
  }

  if (
    typeof expectations.name === 'string' &&
    actual.name !== expectations.name
  ) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected name to equal:', expectations.name),
      ],
    });
  }

  if (
    typeof expectations.message === 'string' &&
    actual.message !== expectations.message
  ) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected message to equal:', expectations.message),
      ],
    });
  }

  if (
    expectations.message instanceof RegExp &&
    !expectations.message.test(actual.message)
  ) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected message to match:', expectations.message),
      ],
    });
  }

  if (
    typeof expectations.code !== 'undefined' &&
    actual.code !== expectations.code
  ) {
    throw new AssertionError({
      assertion,
      message,
      stack,
      values: [
        formatWithLabel(`${prefix} unexpected exception:`, actual),
        formatWithLabel('Expected code to equal:', expectations.code),
      ],
    });
  }
}
module.exports = { formatWithLabel, validateExpectations, assertExpectations };
