// Note that the types for this come from VS Code's built-in TypeScript install
const vscode = require('vscode');

function activate() {
  return;
  vscode.window.showInformationMessage('Hello World from test-extension!');
}

module.exports = {
  activate,
};
