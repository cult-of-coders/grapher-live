Grapher Live
============

Easily visualize data from your Meteor project.
Run test queries.
Test your exposure security with a easy toggle.


## Setting up

```
meteor add cultofcoders:grapher-live

meteor npm install --save-dev react react-mounter react-ace classnames 
```

### Server Side Setup
``` JS
// in your /imports/startup/server
// don't initialize it in your production environment, or it will lead to unwanted data exposure.

import { initialize } from 'meteor/cultofcoders:grapher-live';

initialize(); // exposes a method "grapher_live", used by the React Component
```


### Client Side Setup
``` JS
import { mount } from 'react-mounter';
import {GrapherLive} from 'meteor/cultofcoders:grapher-live';

// mount GrapherLive inside your Flow Router
FlowRouter.route('/grapher', {
  action(params, queryParams) {
      return mount(GrapherLive);
  }
});
```

[localhost:3000/grapher](http://localhost:3000/grapher) is working here.

### Usage

Grapher Live uses *createQuery*:

``` JS
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
