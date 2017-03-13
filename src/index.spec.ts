import { equal } from 'assert'
import * as Fs from 'fs'

import { Inject, Injectable, bootstrap } from 'comet-ioc'
import { Configuration, namespace } from "./index";


process.env['TEMOC_ID_A'] = '5';
process.env['TEMOC_TEST_B'] = 'myVal';

@Injectable()
export class App {

  constructor(@Inject(Configuration) public conf: Configuration) {
    
  }
}

describe('parse', function() {
  
  let app: App

  before('load', () => {

    Fs.writeFileSync('./config.js', `module.exports = { test: true, ab: 'test' }`)

    app = bootstrap(App, {
      declarations: [
        Configuration
      ],
      constants: [{
        provide: namespace,
        useValue: 'temoc'
      }]
    })
  })

  it('camelize env var', () => {
    equal(app.conf.props.idA, '5')
    equal(app.conf.props.testB, 'myVal')
  })

  it('read config file var', () => {
    equal(app.conf.props.ab, 'test')
    equal(app.conf.props.test, true)
  })

  after(() => {
    Fs.unlink('./config.js')
  })
});
