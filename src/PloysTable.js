import React from 'react';

const PloysTable = ({ ploys, tableName }) => {
    return (
      <table className="ploy-table">
        <thead>
          <tr>
            <th colSpan={2}>{tableName}</th>
            {/* <th>Description</th> */}
          </tr>
        </thead>
        <tbody>
          {ploys.map(ploy => (
            <tr key={ploy.name}>
              <td className="name">{ploy.name}</td>
              <td className="desc">{ploy.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default PloysTable;
