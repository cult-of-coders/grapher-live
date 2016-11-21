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
