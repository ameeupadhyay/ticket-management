'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {

    /*
      IMPORT MODEL DIRECTLY
    */

    const model = require(path.join(__dirname, file));

    /*
      STORE MODEL USING MODEL NAME
    */

    db[model.name] = model;
  });

/*
  APPLY ASSOCIATIONS
*/

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;