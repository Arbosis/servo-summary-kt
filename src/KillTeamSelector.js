import React, { useState } from 'react';
import { useKillTeams } from './useKillTeams'; // Custom hook for fetching kill teams
import OperativeRow from './OperativeRow'; // Import the OperativeRow component
import './KillTeamSelector.css'; // CSS file for styling

// Weapon icons
const weaponIcons = {
  M: '⚔️', // Monochrome sword for Melee weapon
  R: '🔫', // Monochrome cross for Range weapon
};

// Mapping shape tokens to Unicode characters
const replaceShapeTokens = (text) => {
  return text
    .replace(/\[CIRCLE\]/g, '⬤')
    .replace(/\[SQUARE\]/g, '■')
    .replace(/\[TRIANGLE\]/g, '▲')
    .replace(/\[PENTAGON\]/g, '⬟');
};

const KillTeamSelector = () => {
  const { killTeams, isLoading, error } = useKillTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [operatives, setOperatives] = useState([]);

  const handleKillTeamSelection = (event) => {
    const teamName = event.target.value;
    const team = killTeams.find(kt => kt.killteamname === teamName);
    setSelectedTeam(team);
    
    if (team) {
      const teamOperatives = team.fireteams.flatMap(fireteam => 
        fireteam.operatives.map(op => ({
          name: op.opname,
          stats: {
            M: op.M,
            APL: op.APL,
            GA: op.GA,
            DF: op.DF,
            SV: op.SV,
            W: op.W,
          },
          weapons: op.weapons.flatMap(weapon => 
            weapon.profiles.map(profile => ({
              name: `${weaponIcons[weapon.weptype] || ''} ${replaceShapeTokens(weapon.wepname)}${profile.name ? ` - ${profile.name}` : ''}`,
              checked: true
            }))
          ),
          abilities: op.abilities || [], // Ensure abilities is an array
          checked: true
        }))
      );
      setOperatives(teamOperatives);
    } else {
      setOperatives([]);
    }
  };

  const toggleOperativeSelection = (index) => {
    setOperatives(ops => ops.map((op, i) => i === index ? { ...op, checked: !op.checked } : op));
  };

  const toggleWeaponSelection = (opIndex, weaponIndex) => {
    setOperatives(ops => ops.map((op, i) => i === opIndex ? {
      ...op,
      weapons: op.weapons.map((w, j) => j === weaponIndex ? { ...w, checked: !w.checked } : w)
    } : op));
  };

  const generateSummary = () => {
    if (!selectedTeam) return;
  
    const summaryWindow = window.open('', '_blank');
  
    let summaryHTML = `
      <html>
        <head>
          <title>Kill Team Summary</title>
          <link rel="stylesheet" type="text/css" href="summaryStyles.css">
          <style>
            /* Additional inline styles if needed */
          </style>
        </head>
        <body>
          ${generateOperativesTable(operatives)}
        </body>
      </html>
    `;
  
    summaryWindow.document.write(summaryHTML);
    summaryWindow.document.close();
  };
  

  const generateOperativesTable = (operatives) => {
    let tableHTML = `
      <table class="striped">
        <thead>
          <tr><th>Operative</th><th>Movement</th><th>Actions</th><th>Grenades</th><th>Defence</th><th>Save</th><th>Wounds</th><th>Weapons</th><th>Abilities</th></tr>
        </thead>
        <tbody>
    `;

    operatives.forEach(operative => {
      if (operative.checked) {
        const weapons = operative.weapons
          .filter(weapon => weapon.checked)
          .map(w => `${w.name}`).join(", ");
        const abilities = (operative.abilities || []).join(", ");
        tableHTML += `
          <tr>
            <td>${operative.name}</td>
            <td>${operative.stats.M}</td>
            <td>${operative.stats.APL}</td>
            <td>${operative.stats.GA}</td>
            <td>${operative.stats.DF}</td>
            <td>${operative.stats.SV}</td>
            <td>${operative.stats.W}</td>
            <td>${weapons}</td>
            <td>${abilities}</td>
          </tr>
        `;
      }
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
  };

  if (isLoading) return <div>Loading kill teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="top-bar">
        <h1>ServoSummary-KT</h1>
        <select onChange={handleKillTeamSelection} className="team-selector">
          <option value="">Select a Kill Team</option>
          {killTeams.map(team => (
            <option key={team.killteamname} value={team.killteamname}>
              {team.factionName} - {team.killteamname}
            </option>
          ))}
        </select>
        {selectedTeam && (
          <button onClick={generateSummary} className="generate-summary-button">
            Generate Summary
          </button>
        )}
      </div>
      {selectedTeam && (
        <table className="operative-table">
          <thead>
            <tr><th>Operative</th><th>Weapons</th></tr>
          </thead>
          <tbody>
            {operatives.map((operative, opIndex) => (
              <OperativeRow
                key={opIndex}
                operative={operative}
                toggleOperative={() => toggleOperativeSelection(opIndex)}
                toggleWeapon={(weaponIndex) => toggleWeaponSelection(opIndex, weaponIndex)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KillTeamSelector;
