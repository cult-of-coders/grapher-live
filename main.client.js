import './ui/styles/grapher-live.less';
import './ui/styles/grapher-docs.less';

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    'react-ace': '3.x.x',
    'react': '0.x.x',
    'classnames': '2.2.x'
}, 'cultofcoders:grapher-live');

export {
    default as GrapherLive
} from './ui/Live.jsx';

export {
    default as GrapherDocumentation
} from './ui/documentation/Documentation.jsx';