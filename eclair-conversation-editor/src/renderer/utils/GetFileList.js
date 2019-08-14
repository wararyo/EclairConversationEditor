'use strict';
const fs = require('fs');
const path = require('path');

//ファイル構造を元にObjectを生成
//itemFuncでfalseを返すとそのitemはObjectに追加されません
export function generateFileTree(folderPath, itemFunc, base = []) {
    //console.log(folderPath);
    return new Promise((resolve, reject) => fs.readdir(folderPath, function(err, items) {
    if (err) reject(err);
    let promises = [];
    items.forEach((itemPath) => {
      let fullPath = path.join(folderPath, itemPath);
      //フォルダは無条件で追加する
      if (fs.statSync(fullPath).isDirectory()) {
        promises.push(generateFileTree(fullPath,itemFunc).then(o => base.push({text:itemPath, id:fullPath, children:o})));//再帰
      }
      //ファイルに関してはitemFuncがあり、trueが返されたなら追加する itemFuncがなくても追加する
      else if (itemFunc !== void 0) {
        if (itemFunc(fullPath)) {
          base.push({text:itemPath, id:fullPath});
        }
      }
      else base.push({text:itemPath, id:fullPath});
    });
    Promise.all(promises).then(() => {
      base.sort((a,b) => {
        var replaceNumberToChar = function(str) {
          let m = str.match(/[0-9]+/);
          if(m !== null) m.forEach((n)=> {if(parseInt(n) !== NaN) str = str.replace(n,n.padStart(3, '0'))});
          return str;
        }
        a = replaceNumberToChar(a.text.toLowerCase());
        b = replaceNumberToChar(b.text.toLowerCase());
        if(a < b){
            return -1;
        }else if(a > b){
            return 1;
        }
        return 0;
      });
      resolve(base);
    });
  }));
};