function EditionInterface(store) {
  this.store = store;
}

EditionInterface.prototype.read = require('./actions/read.js');
EditionInterface.prototype.readJSON = require('./actions/read-json.js');
EditionInterface.prototype.exists = require('./actions/exists');
EditionInterface.prototype.write = require('./actions/write.js');
EditionInterface.prototype.writeJSON = require('./actions/write-json.js');
EditionInterface.prototype.extendJSON = require('./actions/extend-json.js');
EditionInterface.prototype.append = require('./actions/append.js');
EditionInterface.prototype.delete = require('./actions/delete.js');
EditionInterface.prototype.copy = require('./actions/copy.js').copy;
EditionInterface.prototype.copyAsync = require('./actions/copyAsync.js').copyAsync;
// eslint-disable-next-line no-underscore-dangle
EditionInterface.prototype._copySingle = require('./actions/copy.js')._copySingle;
// eslint-disable-next-line no-underscore-dangle
EditionInterface.prototype._copySingleAsync = require('./actions/copyAsync.js')._copySingleAsync;
EditionInterface.prototype.copyTpl = require('./actions/copy-tpl.js');
EditionInterface.prototype.move = require('./actions/move.js');
EditionInterface.prototype.commit = require('./actions/commit.js');

exports.create = function (store) {
  return new EditionInterface(store);
};
