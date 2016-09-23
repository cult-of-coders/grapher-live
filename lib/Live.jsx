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
            loading: false,
            timeElapsed: null,
            result: null,
            error: null,
            checkUser: true,
            body: "{\n\t\n}",
            params: "{\n\t\n}"
        };
    }

    render() {
        const {user} = this.props;
        const editorOpts = {
            $blockScrolling: false,
            showPrintMargin: false,
            fontSize: 18
        };
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
                    &nbsp;
                    <span>(Use Ctrl+Enter or Cmd+Enter)</span>
                </div>
                <div className="section">
                    <div className="wrap">
                        <div className="name">Parameters</div>
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            name="params"
                            value={this.state.params}
                            onChange={this.onChangeParams.bind(this)}
                            height='600px'
                            width='100%'
                            setOptions={editorOpts}
                            commands={commands}
                            />,
                    </div>
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
                            height='600px'
                            width='100%'
                            setOptions={editorOpts}
                            commands={commands}
                            />
                    </div>
                </div>
                <div className="section">
                    <div className="wrap">
                        <div className="name">Results</div>

                        <div className="results">
                            <LiveResults loading={this.state.loading}
                                         error={this.state.error}
                                         result={this.state.result}
                                         timeElapsed={this.state.timeElapsed}
                                         queryTimeElapsed={this.state.queryTimeElapsed}
                                     />
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
            const start = new Date();

            this.setState({loading: true});

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
        return <div>Run your query in { } in the left and press the "Run" button on top.</div>
    }

    return (
        <div>
            <div>Time for response: {timeElapsed} ms.</div>
            <div>Time for db query: {queryTimeElapsed} ms.</div>
            <hr/>
            <JSONPretty json={result} />
        </div>
    )
};

export default createContainer(() => {
    return {
        user: Meteor.user ? Meteor.user() : null
    }
}, Live)