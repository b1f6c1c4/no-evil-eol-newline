'use babel';

import { CompositeDisposable } from 'atom';

export default class LineNumberView {
  constructor(editor) {
    this.update = this.update.bind(this);
    this.subscriptions = new CompositeDisposable();
    this.editor = editor;
    this.editorView = atom.views.getView(editor);

    this.editor.addGutter({ name: 'relative-numbers' })
      .view = this;

    const toUpdate = () => setTimeout(this.update, 0);

    try {
      // Preferred: Subscribe to any editor model changes
      this.subscriptions.add(this.editorView.model.onDidChange(toUpdate));
    } catch (e) {
      // Fallback: Subscribe to initialization and editor changes
      this.subscriptions.add(this.editorView.onDidAttach(toUpdate));
      this.subscriptions.add(this.editor.onDidStopChanging(this.update));
    }
    this.subscriptions.add(this.editor.onDidDestroy(() => { this.subscriptions.dispose(); }));
    this.subscriptions.add(this.editor.onDidChangeCursorPosition(toUpdate));
    this.subscriptions.add(this.editorView.onDidChangeScrollTop(this.update));

    this.update();
  }

  update() {
    const id = this.editor.getLineCount() - 1;
    const sId = this.editor.getScreenLineCount() - 1;
    const isCursor = this.editor.getCursorBufferPosition().row === id;
    const makeRun = (cls, attr) => (row, operations) => {
      const res = typeof row !== 'number'
        ? this.editorView.querySelectorAll(`${cls}${row}`)
        : this.editorView.querySelectorAll(`${cls}[${attr}="${row}"]`);
      res.forEach((ln) => {
        operations.forEach(([v, ad]) => ad ? ln.classList.add(v) : ln.classList.remove(v));
      });
    };
    const runGutter = makeRun('.line-number', 'data-buffer-row');
    const runLine = makeRun('.line', 'data-screen-row');
    const noEol = this.editor.lineTextForBufferRow(id).length !== 0;

    runGutter('.evil-eol-newline', [['evil-eol-newline', false], ['lack-of-eol', noEol]]);
    runLine('.lack-of-eol', [['lack-of-eol', false]]);
    if (!isCursor) {
      runGutter(id, [['evil-eol-newline', true], ['lack-of-eol', noEol]]);
    }
    runLine(sId, [['lack-of-eol', noEol]]);
  }
}
