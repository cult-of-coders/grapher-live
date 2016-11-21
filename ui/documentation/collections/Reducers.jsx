import React from 'react';
import Window from '../Window';
import DataDisplay from '../DataDisplay';

const ReducerItem = ({name, config}) => {
    const data = {
        'Body': <pre>{JSON.stringify(config.body, null, 4)}</pre>,
    };

    return (
        <div className="reducer-item">
            <Window header={<h4>{name}</h4>}>
                <DataDisplay data={data} />
            </Window>
        </div>
    )
};

export default ({name, config}) => {
    return (
        <div className="reducers-wrap">
            <Window header={<h3>Reducers</h3>}>
                {
                    _.map(config, (reducerConfig, reducerName) => (
                        <ReducerItem name={reducerName} config={reducerConfig} key={reducerName} />
                    ))
                }
                {_.keys(config).length == 0
                    ? <div className="no-data">No reducers defined</div>
                    : null
                }
            </Window>
        </div>
    )
};