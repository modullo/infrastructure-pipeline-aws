const fs = require("fs");
const path = require("path");
const util = require("util");
const access = util.promisify(fs.access);
const Str = require("@supercharge/strings");
const yaml = require("js-yaml");
//const spawn = require("child_process").spawn;
//const os = require("os");


async function file_exists(path) {
  try {
    await access(path, fs.constants.R_OK);
    return true;
  } catch (err) {
    //console.error(err)
    return false;
  }
}
exports.file_exists = file_exists;


function readFile(file_type, file_path) {
  try {
    let doc;
    switch (file_type) {
      case "yaml":
        doc = yaml.load(fs.readFileSync(file_path, "utf8"));
        break;
    }
    return doc;
  } catch (err) {
    return false;
  }
}
exports.readFile = readFile;

async function readFileCallback(file_type, file_path, callback) {
    try {
      let doc;
      switch (file_type) {
        case "yaml":
          doc = yaml.load(fs.readFileSync(file_path, "utf8"));
          break;
      }
      //console.log(doc);
      callback(true, doc);
    } catch (err) {
      //console.error(err);
      callback(false, null);
    }
  }
  
  exports.readFileCallback = readFileCallback;