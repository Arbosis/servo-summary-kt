import React from 'react';

const PloysTable = ({ ploys, tableName, togglePloySelection }) => {
    return (
      <table className="ploy-table">
        <thead>
          <tr>
            <th colSpan={2}>{tableName}</th>
            {/* <th>Description</th> */}
          </tr>
        </thead>
        <tbody>
          {ploys.map( (ploy, index) => (
            <tr key={ploy.name}>
              <td className="name">
                <input
                  type="checkbox"
                  checked={ploy.checked}
                  onChange={() => togglePloySelection(index)}
                  className="checkbox"
                />
                {ploy.name}
              </td>
              <td className="desc">{ploy.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

export default PloysTable;
