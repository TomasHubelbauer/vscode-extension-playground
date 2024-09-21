// Run `bun install` in the extension directory to install the `diff` package
const diff = require('diff');

module.exports = function sync(
  /** @type {{ [line: number]: string | number }} */
  data,

  /** @type {string} */
  oldText,

  /** @type {string} */
  newText,

  /** @type {string} */
  value = new Date().toISOString(),

  /** @type {(originalNewLineNumber: number, newLineNumber: number, originalOldLineNumber: number, oldLineNumber: number, lines: number, type: 'added' | 'removed' | 'kept') => void} */
  log = undefined
) {
  /** @type {{ [line: number]: string | number }} */
  const result = {};

  const changes = diff.diffLines(oldText, newText);
  let oldLineNumber = 1;
  let newLineNumber = 1;
  for (const change of changes) {
    const originalOldLineNumber = oldLineNumber;
    const originalNewLineNumber = newLineNumber;

    for (let index = 0; index < change.count; index++) {
      if (change.added) {
        result[newLineNumber++] = value;
      }
      else if (change.removed) {
        oldLineNumber++;
      }
      else {
        result[newLineNumber++] = data[oldLineNumber++];
      }
    }

    log?.(originalNewLineNumber, newLineNumber, originalOldLineNumber, oldLineNumber, change.count, change.added ? 'added' : change.removed ? 'removed' : 'kept');
  }

  return result;
}
