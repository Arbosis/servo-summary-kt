// OperativeStats.js
import React from 'react';

/**
 * Component to display an operative's stats.
 * Takes the stats (M, APL, GA, DF, SV, W) as props and renders a table.
 */
const OperativeStats = ({ stats }) => {
  return (
      <table class="operative-stats">
        <thead>
          <tr>
            <th>M</th>
            <th>APL</th>
            <th>GA</th>
            <th>Df</th>
            <th>Sv</th>
            <th>W</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stats.M}</td>
            <td>{stats.APL}</td>
            <td>{stats.GA}</td>
            <td>{stats.DF}</td>
            <td>{stats.SV}</td>
            <td>{stats.W}</td>
          </tr>
        </tbody>
      </table>
  );
};

export default OperativeStats;
