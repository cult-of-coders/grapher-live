import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Documentation from './Documentation.jsx';
import { prepareForProcess } from 'meteor/cultofcoders:grapher';

import 'brace/mode/javascript';
import 'brace/theme/github';

const editorOpts = {
    $blockScrolling: Infinity,
    showPrintMargin: false,
    fontSize: 18
};

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

                                <span className="check-user">
                                    <input type="checkbox" onChange={this.onCheckForUser.bind(this)} />
                                    <span>
                                        Bypass exposure firewall
                                    </span>
                                </span>

                                <button onClick={this.onDocsToggle.bind(this)} style={{ float: 'right', marginRight: 20 }}>
                                    {this.state.showDocs ? 'Hide' : 'Show'} Docs
                                </button>
                                <a href="http://grapher.cultofcoders.com" target="_blank" style={{ float: 'right', marginRight: 20, marginTop: 6 }}>
                                    Grapher Guide
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

const LiveResults = ({loading, result, error, timeElapsed, queryTimeElapsed}) => {
    if (loading) {
        return <div className="loading">Please wait...</div>
    }

    if (error) {
        return <div className="error">{error}</div>
    }

    if (!result) {
        return <div className="vertical-center-wrap">
            <div className="vertical-center blank">
                Run your query in the left and press the "Run" button on top or just write Ctrl+Enter or Cmd+Enter.
                <br/>
                <br/>
                You can also checkout the Docs in the top right.
                <br/>
                <br/>
                Checking "Bypass Exposure" will retrieve the full data graph without user restrictions.
            </div>
        </div>
    }

    return (
        <div>
            <div className="insight">
                <div className="vertical-center-wrap">
                    <div className="vertical-center">
                        <div>Grapher execution time: {queryTimeElapsed} ms.</div>
                        <div>Full response time: {timeElapsed} ms.</div>
                    </div>
                </div>
            </div>
            <AceEditor
                mode="javascript"
                theme="github"
                name="results-editor"
                value={JSON.stringify(result, null, '\t')}
                setOptions={editorOpts}
            />
        </div>
    )
};

export default createContainer(() => {
    return {
        user: Meteor.user ? Meteor.user() : null
    }
}, Live)