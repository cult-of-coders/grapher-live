import React, { Component } from 'react';
import classNames from 'classnames';

class Window extends React.Component {
    constructor() {
        super();
        this.state = { opened: false }
    }

    render() {
        return (
            <div className={classNames('windower', this.state.opened ? 'shown' : null)}>
                <div className="header" onClick={this.toggleState.bind(this)}>{this.props.header}</div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }

    toggleState() {
        this.setState({
            opened: !this.state.opened
        })
    }
}

const DataDisplay = ({data}) => {
    return (
        <table>
            <tbody>
            {
                _.map(data, (value, key) => {
                    if (value === undefined) {
                        return null;
                    }

                    return (
                        <tr key={key}>
                            <th>{key}</th>
                            <td>{value}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    )
};

const DocumentationCollectionSchemaItem = ({name, config}) => {
    return (
        <div className="schema-item">
            <Window header={<h4>{name} ({config.type})</h4>}>
                <DataDisplay data={{
                    'Type': config.type,
                    'Optional': config.optional ? 'Yes' : 'No',
                    'Default Value': config.defaultValue ? JSON.stringify(config.defaultValue) : undefined
                }}/>
            </Window>
        </div>
    )
};

const DocumentationCollectionSchema = ({name, config}) => {
    return (
        <div className="schema-wrap">
            <Window header={<h3>Schema</h3>}>
                {
                    _.map(config, (schemaConfig, schemaName) => (
                        <DocumentationCollectionSchemaItem name={schemaName} config={schemaConfig} key={schemaName} />
                    ))
                }
                {_.keys(config).length == 0
                    ? <div className="no-data">No schema defined</div>
                    : null
                }
            </Window>
        </div>
    )
};

const DocumentationCollectionLink = ({name, config}) => {
    let data = {};

    _.extend(data, {
        'Related Collection': config.collection ? config.collection : 'Resolver',
    });

    if (config.collection) {
        if (config.isVirtual) {
            _.extend(data, {
                'Link Storage': `Inversed link to collection: "${config.collection}" on field "${config.linkStorageField}"`
            })
        } else {
            _.extend(data, {
                'Link Storage': `Stored as: "${config.linkStorageField}"`,
                'Metadata': config.metadata ? <pre>{JSON.stringify(config.metadata)}</pre> : undefined,
                'Results': config.isOneResult ? 'Single object' : 'Array of objects'
            })
        }
    }

    return (
        <div className="link-item">
            <Window header={<h4>{name} ({config.strategy})</h4>}>
                <DataDisplay data={data} />
            </Window>
        </div>
    )
};


const DocumentationCollectionLinks = ({name, config}) => {
    return (
        <div className="links-wrap">
            <Window header={<h3>Links</h3>}>
                {
                    _.map(config, (linkConfig, linkName) => (
                        <DocumentationCollectionLink name={linkName} config={linkConfig} key={linkName} />
                    ))
                }
                {_.keys(config).length == 0
                    ? <div className="no-data">No links defined</div>
                    : null
                }
            </Window>
        </div>
    )
};

const DocumentationCollection = ({name, config}) => {
    return (
        <div className="collection-wrap">
            <Window header={<h1>{name}</h1>}>
                <div style={{overflow: 'hidden'}}>
                    <div style={{float: 'left', width: '50%'}}>
                        <DocumentationCollectionSchema name={name} config={config.schema} />
                    </div>
                    <div style={{float: 'left', width: '50%'}}>
                        <DocumentationCollectionLinks name={name} config={config.links} />
                    </div>
                </div>
            </Window>
        </div>
    )
};

const DocumentationNamedQuery = ({name, config}) => {
    return (
        <div className="collection-wrap">
            <Window header={<h1>{name}</h1>}>
                <DataDisplay data={{
                    'Collection': config.collection,
                    'Body': <pre>{JSON.stringify(config.body, null, 4)}</pre>,
                    'Params': config.paramsSchema ? <pre>{JSON.stringify(config.paramsSchema, null, 4)}</pre> : 'Not Specified',
                    'Is Exposed': config.isExposed ? 'Yes' : 'No'
                }} />
            </Window>
        </div>
    )
};

class Documentation extends Component {
    constructor() {
        super()

        this.state = {
            show: 'collections'
        }
    }

    render() {
        const documentation = this.props.documentation;

        return (
            <div className="grapher-docs">
                <h1>Grapher Documentation</h1>

                <button onClick={this.toggleShow.bind(this)}>
                    {this.state.show === 'collections'
                        ? 'Show Named Queries'
                        : 'Show Collections'
                    }
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

        return <div>Not Available</div>
    }
}