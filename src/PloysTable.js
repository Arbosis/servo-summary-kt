import React from 'react';

const PloysTable = ({ ploys, tableName }) => {
    return (
      <table className="ploy-table">
        <thead>
          <tr><th>{tableName}</th><th>Description</th></tr>
        </thead>
        <tbody>
          {ploys.map(ploy => (
            <tr key={ploy.name}>
              <td class="name">{ploy.name}</td>
              <td class="desc">{ploy.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default PloysTable;