import { Injectable, Inject, Optional } from "comet-ioc";

export const namespace: symbol = Symbol('namespace')
export const extraConfigPaths: symbol = Symbol('extraConfigPaths')

@Injectable()
export class Configuration {

  _configPaths: string[]
  _usedConfigFile: string
  props: any;

  constructor(
    @Inject(namespace) private _namespace: string, 
    @Optional() @Inject(extraConfigPaths)private  _ecp: string[]) {

    this._configPaths = [];
    this._configPaths.push(`/etc/${this._namespace}`)
    this._configPaths.push(`/usr/share/${this._namespace}`)
    this._configPaths.push(`${__dirname}/..`)
    this._configPaths.push(`${__dirname}/../..`)
    this._configPaths.concat(this._ecp)

    this._namespace = this._namespace || 'comet'
    this._usedConfigFile = null
    this.props = {}

    let conf: Object = {}

    for( let path of this._configPaths) {
      try {
        conf = require(`${path}/config`)
      } catch(e) {
        continue
      }
      this._usedConfigFile = path+'/config'
      break
    }

    if(conf != undefined) {
      // Load every params of file
      for(let param in conf) {
        (<any>this.props)[param] = (<any>conf)[param]
      }
    }

    // Override with Environement variables
    for (let param in process.env) {

      if (param.startsWith(this._namespace.toUpperCase())) {
        let k: string = param.replace(`${this._namespace.toUpperCase()}_`, '');
        (<any>this.props)[Configuration.Camelize(k)] = process.env[param]
      }
    }
  }

  /**
   * return string in environement variable format
   * from camelCase string
   * @param {string} str CamelCase string
   * @return {string} formatted string
   */
  static unCamelize(str: string) {
    return str.split(/(?=[A-Z])/).join('_').toUpperCase()
  }

  /**
   * Format environement variable to camelCase
   * @param {string} str env var to camelize
   * @return {string} camelCase string
   */
  static Camelize(str: string) {

    str = str.toLowerCase();

    while (str.indexOf('_') >= 0) {
      let i = str.indexOf('_')
      if (str[i+1] != undefined) {
        str = str.substr(0, i+1) + str[i+1].toUpperCase() + str.substr(i+1+str[i+1].length);
        str = str.substr(0, i) + str.substr(i+str[i].length);
      }
    }
    return str
  }
}
