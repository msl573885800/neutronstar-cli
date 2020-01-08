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

/**
 * 发布
 * @param {string} env 
 */
function main(env, fileType) {
  if (['oss', 'server'].indexOf(fileType) === -1) {
    console.error(new Error('上传路径不合法'));
    return new Error('上传路径不合法');
  }
  if (fileType === 'oss') {
    console.log('正在上传到 oss...')
    uploadOss(env);
  } else if (fileType === 'server') {
    uploadServer(env);
  }

}

async function uploadOss(env) {
  const deployConfig = util.getDeployConfig(env);
  let rootPath = process.cwd();
  if (deployConfig.oss.basePath) {
    rootPath = nodePath.resolve(rootPath, deployConfig.oss.basePath);
  }
  const ossDistPath = deployConfig.oss.sourcePath;

  const ossClient = new OSS({
    accessKeyId: deployConfig.oss.accessKeyId,
    accessKeySecret: deployConfig.oss.accessKeySecret,
    bucket: deployConfig.oss.bucket,
    region: deployConfig.oss.region
  });

  async function putOss(path) {
    try {
      const putPathName = nodePath.relative(rootPath, path);
      const targetPath = (deployConfig.oss.publicPath + '/' + putPathName);
      const result = await ossClient.put(targetPath, path);
      console.log('ok:' + result.url);
    } catch (e) {
      console.log(e);
    }
  }

  glob(ossDistPath, {
    absolute: true,
    nodir: true,
  }, (err, files) => {
    files.forEach(file => putOss(file))
  });

}

async function uploadServer(env) {
  const deployConfig = util.getDeployConfig(env);
  let rootPath = process.cwd();
  if (deployConfig.server.basePath) {
    rootPath = nodePath.resolve(rootPath, deployConfig.server.basePath);
  }
  const serverDistPath = deployConfig.server.sourcePath;

  const sftpClient = new SFTP();
  closeTimer = null;

  function closeSftp(timeout) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      sftpClient.end();
      console.log('上传结束！');
    }, timeout);
  }

  async function putServer(path) {
    closeSftp(10000); // 5 秒自动关闭
    const putPath = nodePath.relative(rootPath, path);
    const targetPath = nodePath.resolve(deployConfig.server.publicPath, putPath);
    try {
      const result = await sftpClient.put(path, targetPath);
      console.log(result);
    } catch (error) {
      // 错误的可能是目录不存在，先尝试建立目录
      const putPathDir = nodePath.dirname(targetPath);
      console.log('mkdir ', putPathDir);
      sftpClient.mkdir(putPathDir, true).then(async () => {
        try {
        const result = await sftpClient.put(path, targetPath);
        console.log(result);
        } catch (error) {
          console.log(error);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }

  sftpClient.connect({
    host: deployConfig.server.host,
    username: deployConfig.server.username,
    password: deployConfig.server.password
  }).then(() => {
    console.log('正在上传到服务器...');
    closeSftp(10000); // 十秒后关闭
    glob(serverDistPath, {
      absolute: true,
      nodir: true
    }, (err, files) => {
      files.forEach(file => putServer(file));
    })
  });
}

module.exports = main;
