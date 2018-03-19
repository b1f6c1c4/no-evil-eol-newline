'use babel';

import { CompositeDisposable } from 'atom';
import LineNumberView from './line-number-view';

export default {
  config: {
    changeLineNumber: {
      description: 'If the last row does not end with EOL, change the style of the corresponding line number.',
      type: 'string',
      default: 'Buffer',
      enum: [
        { value: 'None', description: 'Line numbers remain visible, yet not emphasized.' },
        { value: 'Screen', description: 'Only the line number for the last screen row is emphasized.' },
        { value: 'Buffer', description: 'Line numbers of the whole buffer row are emphasized.' },
      ],
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
