#!/usr/bin/env node

//使用node开发命令行工具所执行的js脚本必须在顶部加入该声明

import { fstat } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const program = require("commander");
const download = require("download-git-repo");
const handlebars = require("handlebars");
const inquirer = require("inquirer");
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

//原生获取命令行参数的方式
// console.log(process.argv)

const templates = {
  // "qiankun-template-one": {
  //   url: "https://github.com/Lemonadeccc/qiankun-template-one",
  //   downloadUrl: "https://github.com:Lemonadeccc/qiankun-template-one#$master",
  //   description: "Template:qiankun-one",
  // },
  // "qiankun-template-two": {
  //   url: "https://github.com/Lemonadeccc/qiankun-template-two",
  //   downloadUrl: "https://github.com:Lemonadeccc/qiankun-template-two#$master",
  //   description: "Template:qiankun-two",
  // },
  // "vue-template ": {
  //   url: "https://github.com/Lemonadeccc/vue-template",
  //   downloadUrl: "https://github.com:Lemonadeccc/vue-template#$master",
  //   description: "Template:vue-template",
  // },
  // "vue-simple-template": {
  //   url: "https://github.com/Lemonadeccc/vue-simple-template",
  //   downloadUrl: "https://github.com:Lemonadeccc/vue-simple-template#$master",
  //   description: "Template:vue-simple-template",
  // },
  "tpl": {
    url: "direct:https://gitlab.com/Lemonadeccc/condev-cli-template.git",
    downloadUrl: "direct:https://gitlab.com/Lemonadeccc/condev-cli-template.git#$master",
    description: "Template:template-one",
  },
};

program.version("0.1.0");

program
  .command("init <templateName> <projectName>")
  .description("Initialize project template")
  // .option("-s, --setup_mode [mode]","Which setup mode to use")
  .action((templateName, projectName) => {
    //下载之前做loading提示
    const spinner = ora('Templates being downloaded...').start();
    //根据模板名下载对应的模板到本地
    // console.log(templates[templateName])
    const { downloadUrl } = templates[templateName];
    download(downloadUrl, projectName, { clone: true }, (err) => {
      // if (!err) {
        // spinner.fail()//下载失败提示
        // console.log(chalk.red('Failed to initialize template'));
        // return
        // // console.log("Download failed");
      // }
      spinner.succeed() //下载成功提示
        //把项目下的package.json读取出来，使用向导的方式采集用户输入的值，使用模板引擎把输入数据解析到package.json中。
        //解析完毕，把解析之后的结果重新写入package.json中
      inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "Please enter the project's name",
            }
            // {
            //   type: "input",
            //   name: "description",
            //   message: "Please enter the project's description",
            // },
            // {
            //   type: "input",
            //   name: "author",
            //   message: "Please enter the author's name",
            // },
          ])
          .then((answers) => {
            const packagePath = `${projectName}/Main/package.json`
            const packageContent = fs.readFileSync(`${projectName}/Main/package.json`,'utf8')
            const packageResult = handlebars.compile(packageContent)(answers)
            fs.writeFileSync(packagePath,packageResult)
            console.log(logSymbols.success,chalk.green('Initialize template successfully'))
          });
    });
  });

program
  .command("list")
  .description("View all available templates")
  // .option("-s, --setup_mode [mode]","Which setup mode to use")
  .action(() => {
    for (let key in templates) {
      console.log(`
            ${key}  ${templates[key].description}`);
    }
  });

// program
//     .command('exec <cmd>')
//     .alias('ex')
//     .description('execute the given remote cmd')
//     .option("-e, --exc_mode <mode>","Which exec mode to use")
//     .action(function(cmd,options){
//         console.log('exec "%s" using %s mode',cmd,options.exec_mode);
//     }).on('--help',function(){
//         console.log('   Examples:');
//         console.log();
//         console.log('   $ deploy exec sequential');
//         console.log('   $ deploy exec async');
//         console.log();
//     });

// program
//     .command('*')
//     .action(function(env){
//         console.log('deploying "%s",env');
//     });

program.parse(process.argv);
