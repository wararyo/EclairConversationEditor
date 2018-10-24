'use strict';
const fs = require('fs');
const path = require('path');

//----------------------------------------
//・トップフォルダのみのファイルアイテム列挙
//----------------------------------------
//  ・同期
//  ・戻り値にはフォルダフルパスが入る
//  ・戻り値以外は fs.readdir とほぼ同じ
//----------------------------------------
exports.readTopDirSync = (folderPath) => {
  const result = fs.readdirSync(folderPath);
  return result.map((itemName) => {
    return path.join(folderPath, itemName);
  });
};

//----------------------------------------
//・サブフォルダ下位すべてのファイルアイテム列挙
//----------------------------------------
//  ・同期
//  ・戻り値にはフォルダフルパスが入る
//----------------------------------------
exports.readSubDirSync = (folderPath) => {
  let result = [];
  const readTopDirSync = ((folderPath) => {
    let items = fs.readdirSync(folderPath);
    items = items.map((itemName) => {
      return path.join(folderPath, itemName);
    });
    items.forEach((itemPath) => {
      result.push(itemPath);
      if (fs.statSync(itemPath).isDirectory()) {
        readTopDirSync(itemPath);
        //再帰処理
      }
    });
  });
  readTopDirSync(folderPath);
  return result;
};

//----------------------------------------
//・トップフォルダのみのファイルアイテム列挙
//----------------------------------------
//  ・非同期
//  ・errorFunc:  エラー時の処理
//  ・itemFunc:   ファイル/ディレクトリ列挙時の処理
//  ・finishFunc: 処理終了時に一覧を取得する時の処理
//----------------------------------------
exports.readTopDir = (folderPath, errorFunc, itemFunc, finishFunc) => {

  fs.readdir(folderPath, (err, items) => {
    if (err) {
      if (errorFunc) {
        errorFunc(err);
      }
    }

    items = items.map((itemName) => {
      return path.join(folderPath, itemName);
    });

    if (itemFunc) {
      items.forEach((itemPath) => {
        itemFunc(itemPath);
      });
    }

    if (finishFunc) {
      finishFunc(items);
    }

  });
};

//----------------------------------------
//・サブフォルダ下位すべてのファイルアイテム列挙
//----------------------------------------
//  ・非同期
//  ・errorFunc:  エラー時の処理
//  ・itemFunc:   ファイル/ディレクトリ列挙時の処理
//  ・finishFunc: 処理終了時に一覧を取得する時の処理
//----------------------------------------
exports.readSubDir = (folderPath, errorFunc, itemFunc, finishFunc) => {

  let result = [];
  let execCounter = 0;
  const readTopDir = (folderPath) => {
    execCounter += 1;
    fs.readdir(folderPath, function(err, items) {
      if (err) {
        if (errorFunc) {
          errorFunc(err);
        }
      }

      items = items.map((itemName) => {
        return path.join(folderPath, itemName);
      });

      items.forEach((itemPath) => {
        result.push(itemPath);
        if (itemFunc) {
          itemFunc(itemPath);
        }
        if (fs.statSync(itemPath).isDirectory()) {
          //フォルダなら再帰呼び出し
          readTopDir(itemPath);
        }
      });
      execCounter -= 1;
      if (execCounter === 0) {
        if (finishFunc) {
          finishFunc(result);
        }
      }
    });
  }
  readTopDir(folderPath);
};