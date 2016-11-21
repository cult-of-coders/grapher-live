import React from 'react';
import Window from '../Window';
import DataDisplay from '../DataDisplay';

export default ({name, config}) => {
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