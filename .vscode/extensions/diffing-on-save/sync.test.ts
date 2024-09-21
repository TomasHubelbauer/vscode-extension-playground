// Use `bun test` to run tests
import { test, expect } from 'bun:test';
import sync from './sync';

function runTest(
  data: { [line: number]: number } | null,
  oldLines: string[],
  newLines: string[],
  result: { [line: number]: number | string | undefined },
) {
  if (!data) {
    data = {};
    for (let index = 0; index < oldLines.length; index++) {
      const line = index + 1;
      data[line] = line;
    }
  }

  const oldText = oldLines.join('\n');
  const newText = newLines.join('\n');

  console.log(JSON.stringify(data));
  expect(
    sync(
      data,
      oldText,
      newText,
      'now',
      (originalNewLineNumber, newLineNumber, originalOldLineNumber, oldLineNumber, lines, type) => console.log(`new ${originalNewLineNumber} -> ${newLineNumber} | old ${originalOldLineNumber} -> ${oldLineNumber} | ${lines} ${type}`)
    )
  ).toEqual(result);
}

test('added line in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'a new line will be added above this one',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'a new line will be added above this one',
    ],
    {
      1: 1,
      2: 2,
      3: 'now',
      4: 3,
    },
  );
});

test('added line in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'a new line will be added above this one',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'a new line will be added above this one',
    ],
    {
      3: 'now',
    },
  );
});

test('added two lines in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'two new lines will be added above this one',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'this is, too',
      'two new lines will be added above this one',
    ],
    {
      1: 1,
      2: 2,
      3: 'now',
      4: 'now',
      5: 3,
    },
  );
});

test('added two lines in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'two new lines will be added above this one',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'this is, too',
      'two new lines will be added above this one',
    ],
    {
      3: 'now',
      4: 'now',
    },
  );
});

test('added two non-consecutive lines in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'two new lines will be added above and below this one',
      'hell yeah',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'two new lines will be added above and below this one',
      'this one is new, too',
      'hell yeah',
    ],
    {
      1: 1,
      2: 2,
      3: 'now',
      4: 3,
      5: 'now',
      6: 4,
    },
  );
});

test('added two non-consecutive lines in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'two new lines will be added above and below this one',
      'hell yeah',
    ],
    [
      'hello world',
      '',
      'this is a new line',
      'two new lines will be added above and below this one',
      'this one is new, too',
      'hell yeah',
    ],
    {
      3: 'now',
      5: 'now',
    },
  );
});

test('removed line in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'a new line will be removed above this one',
    ],
    {
      1: 1,
      2: 3,
    },
  );
});

test('removed line in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'a new line will be removed above this one',
    ],
    {},
  );
});

test('removed two lines in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'hello!',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'a new line will be removed above this one',
    ],
    {
      1: 1,
      2: 4,
    },
  );
});

test('removed two lines in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'hello!',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'a new line will be removed above this one',
    ],
    {},
  );
});

test('removed two non-consecutive lines in the middle with data', () => {
  runTest(
    null,
    [
      'hello world',
      '',
      'hiya',
      'hello!',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'hiya',
      'a new line will be removed above this one',
    ],
    {
      1: 1,
      2: 3,
      3: 5,
    },
  );
});

test('removed two non-consecutive lines in the middle without data', () => {
  runTest(
    {},
    [
      'hello world',
      '',
      'hiya',
      'hello!',
      'a new line will be removed above this one',
    ],
    [
      'hello world',
      'hiya',
      'a new line will be removed above this one',
    ],
    {},
  );
});
