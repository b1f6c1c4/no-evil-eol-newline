'use babel';

import NoEvilEolNewlineView from './no-evil-eol-newline-view';
import { CompositeDisposable } from 'atom';

export default {

  noEvilEolNewlineView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.noEvilEolNewlineView = new NoEvilEolNewlineView(state.noEvilEolNewlineViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.noEvilEolNewlineView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'no-evil-eol-newline:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.noEvilEolNewlineView.destroy();
  },

  serialize() {
    return {
      noEvilEolNewlineViewState: this.noEvilEolNewlineView.serialize()
    };
  },

  toggle() {
    console.log('NoEvilEolNewline was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
