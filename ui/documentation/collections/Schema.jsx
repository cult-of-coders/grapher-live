import React from 'react';
import Window from '../Window';
import DataDisplay from '../DataDisplay';

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

export default ({name, config}) => {
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