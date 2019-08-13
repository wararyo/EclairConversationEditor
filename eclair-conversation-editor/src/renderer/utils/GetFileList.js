'use strict';
const fs = require('fs');
const path = require('path');

//ファイル構造を元にObjectを生成
//itemFuncでfalseを返すとそのitemはObjectに追加されません
export async function generateFileTree(folderPath, itemFunc, base = []) {
  return new Promise((resolve, reject) => fs.readdir(folderPath, function(err, items) {
    if (err) reject(err);
    items.forEach((itemPath) => {
      let fullPath = path.join(folderPath, itemPath);
      //フォルダは無条件で追加する
      if (fs.statSync(fullPath).isDirectory()) {
        generateFileTree(fullPath, itemFunc).then((o) => {
          base.push({text:itemPath, children:o});//再帰
        });
      }
      //ファイルに関してはitemFuncがあり、trueが返されたなら追加する itemFuncがなくても追加する
      else if (itemFunc !== void 0) {
        if (itemFunc(fullPath)) {
          base.push({text:itemPath});
        }
      }
      else base.push({text:itemPath});
    });
    resolve(base);
  }));
};