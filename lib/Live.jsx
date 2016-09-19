import React from 'react';
import JSONPretty from 'react-json-pretty';
import brace from 'brace';
import AceEditor from 'react-ace';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

class Live extends React.Component {
    constructor() {
        super();

        this.state = {
            result: [],
            error: null,
            checkUser: true
        };
    }

    render() {
        const {user} = this.props;

        return (
            <div className="grapher-live-container">
                <div className="grapher-top-bar">
                    <span className="title">Grapher Live</span>

                    <span className="check-user">
                        <input type="checkbox" onChange={this.onCheckForUser.bind(this)} />
                        <span>
                            Fetch without expose restrictions
                        </span>
                    </span>

                    {user
                        ? <span className="logged-in">Logged in as: {user.emails[0].address}</span>
                        : <span className="logged-in">Not logged in</span>
                    }

                    <button onClick={this.onRun.bind(this)} className="run-query">Run</button>
                </div>
                <div className="section">
                    <div className="wrap">
                        <div className="name">Query</div>
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            name="body"
                            value={this.state.body}
                            onChange={this.onChangeBody.bind(this)}
                            height='50vh'
                            width='100%'
                            editorProps={{$blockScrolling: false}}
                        />
                    </div>

                    <hr/>

                    <div className="wrap">
                        <div className="name">Parameters</div>
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            name="params"
                            value={this.state.params}
                            onChange={this.onChangeParams.bind(this)}
                            height='20vh'
                            width='100%'
                            editorProps={{$blockScrolling: false}}
                            />,
                    </div>
                </div>
                <div className="section">
                    <div className="wrap">
                        <div className="name">Results</div>

                        <div className="results">
                            {this.state.error
                                ? <div className="error">{this.state.error}</div>
                                : <JSONPretty json={this.state.result} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onCheckForUser(event, value) {
        this.setState({
            checkUser: !event.target.checked
        });
    }

    onChangeBody(body) {
        this.setState({body})
    }

    onChangeParams(params) {
        this.setState({params})
    }

    onRun() {
        try {
            const body = eval('(' + this.state.body + ')');
            const params = eval('(' + this.state.params + ')');
            const checkUser = this.state.checkUser;

            Meteor.call('grapher.live', {body, params, checkUser}, (error, result) => {
                if (!error) {
                    this.setState({
                        result,
                        error: null
                    })
                } else {
                    this.setState({error: error.reason})
                }
            })
        } catch (e) {
            this.setState({
                error: e.toString()
            })
        }
    }
}

export default createContainer(() => {
    return {
        user: Meteor.user ? Meteor.user() : null
    }
}, Live)