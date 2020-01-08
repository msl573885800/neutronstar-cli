#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const pkg = require('../package.json');
const inquirer = require('inquirer');
const test = require('../lib/test');
const deploy = require('../lib/deploy');
const upload = require('../lib/upload');

program
  .version(pkg.version)
  .command('deploy')
  .action(function () {
    inquirer.prompt({
      type: 'list',
      name: 'chooseEnv',
      message: '请选择要上传的环境',
      choices: [
        {
          name: '😏  测试环境 test',
          value: 'test'
        }, {
          name: '😈  正式环境 prod (慎选！)',
          value: 'prod'
        }
      ]
    }).then(answers => {
      const env = answers.chooseEnv;
      if (env === 'prod') {
        inquirer.prompt({
          type: 'list',
          name: 'prodCheck',
          message: '⚠️ ⚠️ ⚠️  确定要上传到正式环境？',
          choices: [
            {
              name: '👌  确认上传',
              value: true
            }, {
              name: '❌  取消上传',
              value: false
            }
          ]
        }).then(answers => {
          if (answers.prodCheck) {
            deploy('prod');
          } else {
            return;
          }
        })
      } else if (env === 'test') {
        deploy('test');
      }
    })
  });
program
  .command('upload [file]')
  .action(function (file) {
    console.log(file);
    inquirer.prompt({
      type: 'list',
      name: 'chooseEnv',
      message: '请选择要上传的环境',
      choices: [
        {
          name: '😏  测试环境 test',
          value: 'test'
        }, {
          name: '😈  正式环境 prod (慎选！)',
          value: 'prod'
        }
      ]
    }).then(answers => {
      const env = answers.chooseEnv;
      if (env === 'prod') {
        inquirer.prompt({
          type: 'list',
          name: 'prodCheck',
          message: '⚠️ ⚠️ ⚠️  确定要上传到正式环境？',
          choices: [
            {
              name: '👌  确认上传',
              value: true
            }, {
              name: '❌  取消上传',
              value: false
            }
          ]
        }).then(answers => {
          if (answers.prodCheck) {
            upload('prod', file);
          } else {
            return;
          }
        })
      } else if (env === 'test') {
        upload('test', file);
      }
    })
  })

program.parse(process.argv);