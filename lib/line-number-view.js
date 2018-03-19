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
    this.subscriptions.add(this.editor.onDidChangeSoftWrapped(() => setTimeout(this.update, 10)));
    this.subscriptions.add(this.editorView.onDidChangeScrollTop(this.update));
    this.subscriptions.add(atom.config.onDidChange('no-evil-eol-newline.changeLineNumber', this.update));
    this.subscriptions.add(atom.config.onDidChange('no-evil-eol-newline.appendIcon', this.update));

    this.update();
  }

  update() {
    const changeLineNumber = atom.config.get('no-evil-eol-newline.changeLineNumber');
    const appendIcon = atom.config.get('no-evil-eol-newline.appendIcon');

    const id = this.editor.getLineCount() - 1;
    const sId = this.editor.getScreenLineCount() - 1;
    const isCursor = this.editor.getCursorBufferPosition().row === id;
    const noEol = this.editor.lineTextForBufferRow(id).length !== 0;

    const get = (s) => this.editorView.querySelectorAll(s);
    const set = (v, ad) => (lns) => ad
      ? lns.forEach((ln) => ln.classList.add(v))
      : lns.forEach((ln) => ln.classList.remove(v));
    const fromAttr = (key, val) => `[${key}="${val}"]`;

    set('evil-eol-newline', false)(get('.evil-eol-newline'));
    set('lack-of-eol', false)(get('.lack-of-eol'));
    if (!isCursor && !noEol) {
      set('evil-eol-newline', true)(get(`.line-number${fromAttr('data-buffer-row', id)}`));
    }
    if (changeLineNumber === 'Buffer') {
      set('lack-of-eol', noEol)(get(`.line-number${fromAttr('data-buffer-row', id)}`));
    } else if (changeLineNumber === 'Screen') {
      set('lack-of-eol', noEol)(get(`.line-number${fromAttr('data-screen-row', sId)}`));
    }
    if (appendIcon) {
      set('lack-of-eol', noEol)(get(`.line${fromAttr('data-screen-row', sId)}`));
    }
  }
}
