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
    .replace(/\[PENT\]/g, '⬟');
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
            M: replaceShapeTokens(op.M),
            APL: op.APL,
            GA: op.GA,
            DF: op.DF,
            SV: op.SV,
            W: op.W,
          },
          weapons: op.weapons.flatMap(weapon => 
            weapon.profiles.map(profile => ({
              name: `${weaponIcons[weapon.weptype] || ''} ${weapon.wepname}${profile.name ? ` - ${profile.name}` : ''}`,
              stats: {
                A: profile.A,
                BS: profile.BS,
                D: profile.D,
                SR: profile.SR,
              },
              checked: weapon.isdefault === 1
            }))
          ),
          abilities: op.abilities.map(ability => ({
            title: ability.title,
            description: ability.description
          })) || [],
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
    let tableHTML = ``;

    operatives.forEach(operative => {
      if (operative.checked) {
        tableHTML += `
        <div class="Card">
          <table class="operative">
            <tbody>
              <tr>
                <th class="Name" rowspan="2">${operative.name}</th>
                <th>M</th>
                <th>APL</th>
                <th>GA</th>
                <th>DF</th>
                <th>SV</th>
                <th>W</th>
              </tr>
              <tr>
                <td>${operative.stats.M}</td>
                <td>${operative.stats.APL}</td>
                <td>${operative.stats.GA}</td>
                <td>${operative.stats.DF}</td>
                <td>${operative.stats.SV}</td>
                <td>${operative.stats.W}</td>
              </tr>
            </tbody>
          </table>
          <table class="weapons">
            <tbody>
              <tr>
                <th class="name">Name</th>
                <th class="bs">Skill</th>
                <th class="attack">A</th>
                <th class="damage">D</th>
                <th>SR</th>
              </tr>
              ${operative.weapons
                .filter(weapon => weapon.checked)
                .map(weapon => `
                  <tr>
                    <td>${weapon.name}</td>
                    <td>${weapon.stats.BS}</td>
                    <td>${weapon.stats.A}</td>
                    <td>${weapon.stats.D}</td>
                    <td>${weapon.stats.SR}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          <table class="abilityList">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
              ${operative.abilities
                .map(ability => `
                  <tr>
                    <td class="name">${ability.title}</td>
                    <td class="desc">${ability.description}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
        `;
      }
    });

    return tableHTML;
  };

  if (isLoading) return <div>Loading kill teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="top-bar">
        <h1 className="app-title">ServoSummary-KT</h1>
        <div className="controls">
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
