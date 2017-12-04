import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import brace from 'brace';
import AceEditor from 'react-ace';
import LiveResults from './LiveResults';
import Documentation from './documentation/Documentation.jsx';
import { prepareForProcess } from 'meteor/cultofcoders:grapher';

import 'brace/mode/javascript';
import 'brace/theme/github';

import editorOpts from './editorOpts';

class Live extends React.Component {
    constructor() {
        super();

        this.state = {
            showDocs: false,
            loading: false,
            timeElapsed: null,
            result: null,
            error: null,
            checkUser: true,
            body: "{\n\t\n}",
            params: "{\n\t\n}"
        };
    }

    componentDidMount() {
        var editor = ace.edit(document.getElementById('body'));
        editor.getSession().setUseWorker(false);
        editor = ace.edit(document.getElementById('params'));
        editor.getSession().setUseWorker(false);
    }

    render() {
        const {user} = this.props;
        const commands = [{
            name: 'save',
            bindKey: {win: "Ctrl-Enter", "mac": "Cmd-Enter"},
            exec: (editor) => {
                this.onRun()
            }
        }];

        return (
            <div className="grapher-live-container">
                <div className="grapher-top-bar">
                    <div className="vertical-center-wrap">
                        <div className="vertical-center">
                            <div>
                                <span className="title">Grapher Live!</span>

                                <button onClick={this.onRun.bind(this)} className="run-query">Run</button>
                                {user
                                    ? <span className="logged-in">Logged in as: {user.emails[0].address}</span>
                                    : <span className="logged-in">Not logged in</span>
                                }
                                {!Meteor.isProduction &&
                                <span className="check-user">
                                    <input type="checkbox" onChange={this.onCheckForUser.bind(this)} />
                                    <span>
                                        Bypass exposure firewall
                                    </span>
                                </span>
                                }

                                <button onClick={this.onDocsToggle.bind(this)} style={{ float: 'right', marginRight: 20 }}>
                                    {this.state.showDocs ? 'Show Results' : 'Show Docs'}
                                </button>
                                <a href="https://github.com/cult-of-coders/grapher/blob/master/docs/index.md" target="_blank" style={{ float: 'right', marginRight: 20, marginTop: 6 }}>
                                    Grapher Documentation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="left">
                    <div className="grapher-live-query wrap">
                        <div className="name">Query</div>
                        <AceEditor
                            mode="javascript"
                            theme="github"
                            name="body"
                            value={this.state.body}
                            onChange={this.onChangeBody.bind(this)}
                            setOptions={editorOpts}
                            commands={commands}
                            />
                    </div>
                    <div className="grapher-live-parameters wrap">
                        <div className="name">Parameters</div>
                        <AceEditor
                            mode="javascript"
                            theme="github"
                            name="params"
                            value={this.state.params}
                            onChange={this.onChangeParams.bind(this)}
                            setOptions={editorOpts}
                            commands={commands}
                            />
                    </div>
                </div>
                <div className="right">
                    <div className="grapher-live-results" style={{ display: this.state.showDocs ? 'none' : 'block' }}>
                        <LiveResults loading={this.state.loading}
                                     error={this.state.error}
                                     result={this.state.result}
                                     timeElapsed={this.state.timeElapsed}
                                     queryTimeElapsed={this.state.queryTimeElapsed}
                                 />
                    </div>
                    <div className="grapher-documentation" style={{ display: this.state.showDocs ? 'block' : 'nonde' }}>
                        <Documentation />
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

    onDocsToggle() {
        this.setState({
            showDocs: !this.state.showDocs
        })
    }

    onRun() {
        try {
            let body = eval('(' + this.state.body + ')');
            body = prepareForProcess(body);

            const params = eval('(' + this.state.params + ')');
            const checkUser = this.state.checkUser;
            const start = new Date();

            this.setState({loading: true, showDocs: false});

            Meteor.call('grapher.live', {body, params, checkUser}, (error, response) => {
                this.setState({loading: false});

                if (!error) {
                    const end = new Date();
                    this.setState({
                        timeElapsed: (end.getTime() - start.getTime()),
                        queryTimeElapsed: response.timeElapsedMs,
                        result: response.data,
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
