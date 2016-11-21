import React from 'react';
import Window from '../Window';
import DataDisplay from '../DataDisplay';

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


export default ({name, config}) => {
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