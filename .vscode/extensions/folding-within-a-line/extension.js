// Note that the types for this come from VS Code's built-in TypeScript install
const vscode = require('vscode');

function activate() {
  return;
  const provider = new InlineFoldingRangeProvider();
  vscode.languages.registerFoldingRangeProvider({ scheme: 'file', language: 'markdown' }, provider);
  vscode.languages.registerFoldingRangeProvider({ scheme: 'untitled', language: 'markdown' }, provider);
}

module.exports = {
  activate,
};

/** @implements {vscode.FoldingRangeProvider} */
class InlineFoldingRangeProvider {
  provideFoldingRanges(
    /** @type {vscode.TextDocument} */
    document,

    /** @type {vscode.FoldingContext} */
    _context,

    /** @type {vscode.CancellationToken} */
    _token
  ) {
    const foldingRage = new vscode.FoldingRange(2, 11);
    return [foldingRage];
  }
}
