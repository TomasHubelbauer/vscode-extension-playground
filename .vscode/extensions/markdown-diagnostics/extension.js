// Note that the types for this come from VS Code's built-in TypeScript install
const vscode = require('vscode');

function activate(
  /** @type {vscode.ExtensionContext} */
  context
) {
  const collection = vscode.languages.createDiagnosticCollection('markdown-diagnostics');

  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document, collection);
  }
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      updateDiagnostics(editor.document, collection);
    }
  }));
}

module.exports = {
  activate,
};

function updateDiagnostics(
  /** @type {vscode.TextDocument} */
  document,

  /** @type {vscode.DiagnosticCollection} */
  collection
) {
  collection.clear();
  if (!document || document.languageId !== 'markdown') {
    return;
  }

  for (let index = 0; index < document.lineCount; index++) {
    const line = document.lineAt(index);
    const text = line.text;
    if (!text) {
      continue;
    }

    const match = /^(?<level>#{1,6}) (?<character>\w)/.exec(text);
    if (!match) {
      continue;
    }

    const offset = match.groups.level.length;
    const character = match.groups.character;
    if (character !== character.toUpperCase()) {
      collection.set(document.uri, [{
        code: '',
        message: 'Heading should be capitalized',
        range: new vscode.Range(new vscode.Position(index, match.index + offset + 1), new vscode.Position(index, match.index + offset + 2)),
        severity: vscode.DiagnosticSeverity.Error,
        source: '',
      }]);
    }
  }
}
