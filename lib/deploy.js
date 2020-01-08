/**
 * 部署静态资源到服务器
 */

const OSS = require('ali-oss');
const fs = require('fs');
const nodePath = require('path');
const SFTP = require('ssh2-sftp-client');
const util = require('./util');
const sh = require('shelljs');
const glob = require('glob');
const upload = require('./upload');

/**
 * 发布
 * @param {string} env 
 */
function main(env) {
  // console.log('正在编译...');
  // if (env === 'test') {
  //   sh.exec('npm run build:test')
  // } else {
  //   sh.exec('npm run build')
  // }
  // console.log('编译完成，准备上传');

  upload(env, 'oss');
  upload(env, 'server');

}

module.exports = main;
