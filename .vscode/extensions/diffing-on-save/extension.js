// Note that the types for this come from VS Code's built-in TypeScript install
const vscode = require('vscode');
const fs = require('fs');
const sync = require('./sync');
const timeago = require('time-ago');

function activate() {
  return;

  vscode.workspace.onWillSaveTextDocument(async (event) => {
    if (event.document.languageId !== 'markdown') {
      return;
    }

    const data = await getData(event.document);
    const oldText = await fs.promises.readFile(event.document.fileName, 'utf-8');
    const newText = event.document.getText();
    await fs.promises.writeFile(
      getPath(event.document),
      JSON.stringify(sync(data ?? {}, oldText, newText), null, 2)
    );

    if (vscode.window.activeTextEditor?.document !== event.document) {
      return;
    }

    await decorate(vscode.window.activeTextEditor);
  });

  vscode.window.onDidChangeActiveTextEditor(async editor => {
    if (editor) {
      await decorate(editor);
    }
  });

  vscode.workspace.onDidOpenTextDocument(async document => {
    const editor = vscode.window.visibleTextEditors.find(editor => editor.document === document);
    if (editor) {
      await decorate(editor);
    }
  });
}

module.exports = {
  activate,
};

const directory = vscode.extensions.getExtension('TomasHubelbauer.diffing-on-save').extensionPath;

function getPath(
  /** @type {vscode.TextDocument} */
  document
) {
  return `${directory}/data/${document.fileName.replace(/[:\\\/]/g, '-')}.json`;
}

/**
 * @returns {Promise<{ [line: number]: string; }>}
 */
async function getData(
  /** @type {vscode.TextDocument} */
  document
) {
  const path = getPath(document);
  try {
    const text = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(text);
  }
  catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

const decorationType = vscode.window.createTextEditorDecorationType({
  borderWidth: '1px',
});

// https://coolors.co/palette/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff-fffffc
const COLORS = {
  second: '#FFD6A5',
  seconds: '#FFD6A5',
  minute: '#FDFFB6',
  minutes: '#FDFFB6',
  hour: '#CAFFBF',
  hours: '#CAFFBF',
  day: '#9BF6FF',
  days: '#9BF6FF',
  week: '#A0C4FF',
  weeks: '#A0C4FF',
  month: '#BDB2FF',
  months: '#BDB2FF',
  year: '#FFC6FF',
  years: '#FFC6FF',
};

async function decorate(
  /** @type {vscode.TextEditor} */
  editor
) {
  if (editor.document.languageId !== 'markdown') {
    return;
  }

  const data = await getData(editor.document);
  if (!data) {
    return;
  }

  /** @type {vscode.DecorationOptions[]} */
  const decorations = [];

  for (let index = 0; index < editor.document.lineCount; index++) {
    const stamp = data[index + 1];
    if (!stamp) {
      continue;
    }

    const ago = timeago.ago(stamp);
    const color = COLORS[ago.split(' ')[1]];
    if (color) {
      decorations.push({
        range: new vscode.Range(index, 0, index, 0),
        hoverMessage: `${ago} ago (${stamp})`,
        renderOptions: {
          before: {
            border: `1px solid ${color}`,
            contentText: '',
          },
        },
      });
    }
  }

  editor.setDecorations(decorationType, decorations);
}
