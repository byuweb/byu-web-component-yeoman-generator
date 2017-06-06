/**
 *  @license
 *    Copyright <%= copyrightYear %> Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('underscore.string');
const path = require('path');
const yosay = require('yosay');

const VALID_NAME = /^[a-z][a-z0-9\-]+[a-z0-9]$/;

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`
 ____  ____  
|_  _||_  _| 
  \\ \\  / /   
   \\ \\/ /    
   _|  |_    
  |______|   
             
Welcome to the BYU Web Component generator!`
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your component?',
      default: 'byu-fancy-component',
      filter(answer) {
        return answer.toLowerCase();
      },
      validate(answer) {
        if (!VALID_NAME.test(answer)) {
          return 'component name must consist of lowercase letters, numbers, and dashes';
        }
        if (answer.search('-') === -1) {
          return 'component name must contain at least one dash';
        }
        return true;
      }
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let me = this;
    let name = this.props.name;
    let context = {
      name,
      camelName: _.capitalize(_.camelize(name)),
      copyrightYear: new Date().getFullYear()
    };

    tpl('_package.json', 'package.json');
    tpl('_.editorconfig', '.editorconfig');
    tpl('_.gitignore', '.gitignore');
    tpl('gulpfile.js');
    tpl('.cdn-config.yml');
    tpl('.gitattributes');
    tpl('README.md');
    tpl('entrypoint.js', name + '.js');
    tpl('entrypoint.scss', name + '.scss');
    tpl('entrypoint.scss', name + '.scss');
    tpl('demo.html');

    let componentSrc = path.join('component', 'component');
    let componentDest = path.join(name, name);

    tpl(componentSrc + '.js', componentDest + '.js');
    tpl(componentSrc + '.scss', componentDest + '.scss');
    tpl(componentSrc + '-common.scss', componentDest + '-common.scss');
    tpl(componentSrc + '-extras.scss', componentDest + '-extras.scss');
    tpl(componentSrc + '.html', componentDest + '.html');

    function tpl(src, dest) {
      if (!dest) {
        dest = src;
      }
      me.fs.copyTpl(
        me.templatePath(src),
        me.destinationPath(dest),
        context
      );
    }
  }

  install() {
    this.npmInstall([
      'byu-web-component-utils@>=0.4.1'
    ]);

    this.npmInstall([
      'browser-sync',
      'byu-web-component-build',
      'gulp'
    ], {'save-dev': true});
  }
};
