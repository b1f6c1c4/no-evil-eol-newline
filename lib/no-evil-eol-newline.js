'use babel';

import { CompositeDisposable } from 'atom';
import LineNumberView from './line-number-view';

export default {
  config: {
    markBufferRow: {
      description: 'If the last row does not end with EOL, mark the line number of the last buffer row as error. SHOULD NOT be used with markScreenRow.',
      type: 'boolean',
      default: true,
    },
    markScreenRow: {
      description: 'If the last row does not end with EOL, mark the line number of the last screen row as error. SHOULD NOT be used with markBufferRow.',
      type: 'boolean',
      default: false,
    },
    appendIcon: {
      description: 'If the last row does not end with EOL, append an icon at the last screen row',
      type: 'boolean',
      default: true,
    },
  },

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
