Grapher Live
============

Easily visualize data from your Meteor project.
Run test queries.
Test your exposure security with a easy toggle.


## Setting up

```
meteor add cultofcoders:grapher-live

meteor npm install --save react react-ace classnames 
```

### Server Side Setup
```
// in your /imports/startup/server
// don't initialize it in your production environment, or it will lead to unwanted data exposure.

import { initialize } from 'meteor/cultofcoders:grapher-live';

initialize(); // exposes a method "grapher_live", used by the React Component
```


### Client Side Setup
```
// client side expose a route using your router
// example with FlowRouter

import React from 'react';
import { GrapherLive } from 'meteor/cultofcoders:grapher-live';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

FlowRouter.route('/grapher', {
    action() {
        mount(GrapherLive);
    }
});
```

### Usage

Grapher Live uses *createQuery*:

```
// query
{
    tasks: {
        $filter({filters, params}) {
            filters.isChecked = params.isChecked;
        }
    }
}

// params example
{
    isChecked: true
}
```