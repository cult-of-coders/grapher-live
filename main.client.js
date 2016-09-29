import './lib/grapher-live.less';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    'react-ace': '3.x.x',
    'react': '15.x.x'
}, 'cultofcoders:grapher-live');

export {
    default as GrapherLive
} from './lib/Live.jsx';