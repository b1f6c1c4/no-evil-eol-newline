'use babel';

import { CompositeDisposable } from 'atom';
import LineNumberView from './line-number-view';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      if (!editor.gutterWithName('relative-numbers')) {
        return new LineNumberView(editor);
      }
      return undefined;
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    for (const editor of atom.workspace.getTextEditors()) {
      const obj = editor.gutterWithName('relative-numbers');
      if (obj) {
        obj.view.destroy();
      }
    }
  },

};
