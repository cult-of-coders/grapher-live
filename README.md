Grapher Live
============

Easily visualize data from your Meteor project.
Run test queries.
Test your exposure security with a easy toggle.


## Setting up

```
meteor add cultofcoders:grapher-live

meteor npm install --save-dev react react-ace classnames 
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
import {GrapherLive} from 'meteor/cultofcoders:grapher-live';

// mount GrapherLive inside your router
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