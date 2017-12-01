import React from 'react';
import AceEditor from 'react-ace';
import editorOpts from './editorOpts';

export default ({loading, result, error, timeElapsed, queryTimeElapsed}) => {
    if (loading) {
        return <div className="loading">Please wait...</div>
    }

    if (error) {
        return <div className="error">{error}</div>
    }

    if (!result) {
        return <div className="vertical-center-wrap">
            <div className="vertical-center blank">
                <div className="explain">
                    <p>
                        Run your query in the left and press the <strong>Run</strong> button on top or just write Ctrl+Enter or Cmd+Enter.
                    </p>
                    <p>
                        To view your current schema, click on <strong>Show Docs</strong> in the top right.
                    </p>
                    <p>
                        Checking <strong>Bypass exposure firewall</strong> will retrieve the full data graph without user restrictions.
                    </p>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <div className="insight">
                <div className="vertical-center-wrap">
                    <div className="vertical-center">
                        <div className="explain">
                            <p>Grapher execution time: <strong>{queryTimeElapsed} ms</strong></p>
                            <p>Full round-trip time: <strong>{timeElapsed} ms</strong></p>
                        </div>
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
