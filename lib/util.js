const fs = require('fs');
const path = require('path');
const deployConfig = require('../config/deploy.config');

const util = {};

/**
 * @param {string} dirPath  - 路径
 * @param {function} func - 执行函数 
 */
util.readDir = function(dirPath, func) {
  function read(basePath, subPath) {
    try {
      const files = fs.readdirSync(basePath + '/' + subPath, {
        withFileTypes: true
      });
      for (let i = 0; i < files.length; i++) {
        if (files[i].isDirectory()) {
          const pathName = subPath ? subPath + '/' + files[i].name : files[i].name;
          read(basePath, pathName);
        } else if (files[i].isFile()) {
          func({
            path: path.resolve(basePath + '/' + subPath, files[i].name),
            name: files[i].name
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (typeof dirPath === 'string') {
    read(dirPath, '');
  } else if (dirPath instanceof Array) {
    dirPath.forEach(dirPathItem => read(dirPathItem, ''));
  }
}

util.getDeployConfig = function(env) {
  const currentDir = process.cwd();
  const projectConfigStr = fs.readFileSync(currentDir + '/edge.config.json', {
    encoding: 'utf8', flag: 'r'
  });
  const projectConfig = JSON.parse(projectConfigStr);
  const config = deployConfig[env];
  Object.assign(config.oss, projectConfig[env].oss);
  Object.assign(config.server, projectConfig[env].server);
  return config;
}

module.exports = util;
