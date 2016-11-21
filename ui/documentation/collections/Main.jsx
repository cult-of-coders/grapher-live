import React from 'react';

import Schema from './Schema';
import Links from './Links';
import Reducers from './Reducers';
import Window from '../Window';
import DataDisplay from '../DataDisplay';

export default ({name, config}) => {
    return (
        <div className="collection-wrap">
            <Window header={<h1>{name}</h1>}>
                {config.isExposed
                    ?
                    <div>
                        <DataDisplay data={{
                            isExposed: config.isExposed ? 'Yes' : 'No',
                            exposureBody: config.exposureBody ? <pre>{JSON.stringify(config.exposureBody, null, 4)}</pre> : undefined,
                        }} />
                    </div>
                    : null
                }
                <div style={{overflow: 'hidden'}}>
                    <div style={{float: 'left', width: '50%'}}>
                        <Schema name={name} config={config.schema} />
                    </div>
                    <div style={{float: 'left', width: '50%'}}>
                        <Links name={name} config={config.links} />
                    </div>
                </div>
                {_.keys(config.reducers).length > 0
                    ? <Reducers name={name} config={config.reducers} />
                    : null
                }
            </Window>
        </div>
    )
};