import {recursiveFetch, createGraph, createQuery} from 'meteor/cultofcoders:grapher';

export default initializer = () => {
    Meteor.methods({
        'grapher.live'({body, params, checkUser = false}) {
            const query = createQuery(body, params);

            const userId = checkUser ? this.userId : undefined;
            console.log(userId);

            return query.fetch({userId})
        }
    })
};