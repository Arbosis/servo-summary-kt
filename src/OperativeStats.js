// OperativeStats.js
import React from 'react';

/**
 * Component to display an operative's stats.
 * Takes the stats (M, APL, GA, DF, SV, W) as props and renders a table.
 */
const OperativeStats = ({ stats }) => {
  return (
    <table className="w-full mt-1 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-1">M</th>
          <th className="border p-1">APL</th>
          <th className="border p-1">GA</th>
          <th className="border p-1">Df</th>
          <th className="border p-1">Sv</th>
          <th className="border p-1">W</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-1">{stats.M}</td>
          <td className="border p-1">{stats.APL}</td>
          <td className="border p-1">{stats.GA}</td>
          <td className="border p-1">{stats.DF}</td>
          <td className="border p-1">{stats.SV}</td>
          <td className="border p-1">{stats.W}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default OperativeStats;
