import React from 'react';

export default ({data}) => {
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
                            <td>
                                {value}
                            </td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    )
};