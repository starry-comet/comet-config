comet-config
==========

[![Build Status](https://travis-ci.org/starry-comet/comet-config.svg?branch=master)](https://travis-ci.org/starry-comet/comet-config)
[![npm](https://img.shields.io/npm/v/comet-config.svg)]()
[![NSP Status](https://nodesecurity.io/orgs/starry-comet/projects/16308b17-8119-4c7f-ae9f-71787459f679/badge)](https://nodesecurity.io/orgs/starry-comet/projects/16308b17-8119-4c7f-ae9f-71787459f679)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cd62c6e76a6d4d1c8d51b15fbb784f23)](https://www.codacy.com/app/miton18/comet-config?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=starry-comet/comet-config&amp;utm_campaign=Badge_Grade)

<p align="center">
  <img height="200" src="https://github.com/starry-comet/comet/blob/master/resources/images/comet.png?raw=true">
</p>

## Roles
Use a namespace to join environment variables with configuration file and expose a configuration object.

## Engine
Any configuration property can be set in environement variable or config file, an environment overrride all files.
A environment property is translate from `NAMESPACE_MY_VAR` to `myVar` in *Configuration* object

## Utils
You can add additional path to look for config files. the symbol you must provide is `extraConfigPaths`, it's an array of string.

## Config file example
```js
module.exports = { 
  key: 'value',
  test: true, 
  ab: 'test' 
}
```

## Usage

```ts
process.env['TEMOC_ENVIRONEMENT_PROPERTY'] = 'property-value'

import { Inject, Injectable, bootstrap } from 'comet-ioc'
import { Configuration, namespace } from "comet-config";

@Injectable()
export class App {
  constructor(@Inject(Configuration) public conf: Configuration) { }
}

app = bootstrap(App, {
  declarations: [
    Configuration
  ],
  constants: [{
    provide: namespace,
    useValue: 'temoc'
  }]
})

console.log( app.conf.props.environementProperty ) // display: property-value
```