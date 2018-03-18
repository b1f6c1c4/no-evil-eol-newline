'use babel';

import { CompositeDisposable } from 'atom';

export default class LineNumberView {
  constructor(editor) {
    this.update = this.update.bind(this);
    this.subscriptions = new CompositeDisposable();
    this.editor = editor;
    this.editorView = atom.views.getView(editor);
    this.lastUpdateId = null;

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
    if (this.editor.getCursorBufferPosition().row === id) {
      return;
    }
    const run = (row, operations) => {
      const res = this.editorView.rootElement.querySelectorAll(`.line-number[data-buffer-row="${row}"]`);
      res.forEach((ln) => {
        operations.forEach(([v, ad]) => ad ? ln.classList.add(v) : ln.classList.remove(v));
      });
      return !!res.length;
    };
    const noEol = this.editor.lineTextForBufferRow(id).length !== 0;

    if (this.lastUpdateId === id) {
      run(id, [['evil-eol-newline', true], ['lack-of-eol', noEol]]);
      return;
    }

    if (this.lastUpdateId !== null) {
      run(this.lastUpdateId, [['evil-eol-newline', false], ['lack-of-eol', false]]);
    }
    if (run(id, [['evil-eol-newline', true], ['lack-of-eol', noEol]])) {
      this.lastUpdateId = id;
    } else {
      this.lastUpdateId = null;
    }
  }
}
