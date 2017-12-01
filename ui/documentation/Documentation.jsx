import React, { Component } from 'react';
import DocumentationCollection from './collections/Main';
import DocumentationNamedQuery from './collections/NamedQuery';
import classNames from 'classnames';

class Documentation extends Component {
    constructor() {
        super();

        this.state = {
            show: 'named_queries'
        }
    }

    render() {
        const documentation = this.props.documentation;

        return (
            <div className="grapher-docs">
                <h1>Grapher Documentation</h1>

                <button onClick={() => this.setState({show: 'named_queries'})}
                        className={classNames({active: (this.state.show == 'named_queries')})}
                >
                    Named Queries
                </button>
                {' '}
                <button onClick={() => this.setState({show: 'collections'})}
                        className={classNames({active: (this.state.show == 'collections')})}
                >
                    Show Collections
                </button>

                {this.state.show === 'collections'
                    ?
                    _.map(documentation.collections, (config, name) => {
                        return <DocumentationCollection name={name} config={config} key={name} />
                    })
                    :
                    <div>
                        <div className="explain">
                            Named queries are called directly in the QUERY editor like:
                            <pre>{`{ queryName: { params } }`}</pre>
                        </div>
                        {
                            _.map(documentation.namedQueries, (config, name) => {
                                return <DocumentationNamedQuery name={name} config={config} key={name} />
                            })
                        }
                    </div>
                }
            </div>
        )
    }

    toggleShow() {
        this.setState({
            show: (this.state.show === 'collections') ? 'namedQueries' : 'collections'
        })
    }
}

export default class extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        Meteor.call('grapher.live_docs', (err, res) => {
            this.setState({err, res})
        })
    }

    render() {
        const documentation = this.state.res;
        if (documentation) {
            return <Documentation documentation={documentation} />;
        }

        return <div>Not Available. Did you initialize it ?</div>
    }
}