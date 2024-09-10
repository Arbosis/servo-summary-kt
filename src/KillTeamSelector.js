import React, { useState, useEffect } from 'react';
import OperativeStats from './OperativeStats'; // Import the new component

// Weapon icons
const weaponIcons = {
  M: '⚔️', // Monochrome sword for Melee weapon
  R: '✚', // Monochrome cross for Range weapon
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
  const [killTeams, setKillTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [operatives, setOperatives] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchKillTeams();
  }, []);

  const fetchKillTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://raw.githubusercontent.com/vjosset/killteamjson/main/compendium.json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Data structure is not as expected: root should be an array');
      }

      const teams = data.flatMap(faction => 
        faction.killteams ? faction.killteams.map(team => ({
          ...team,
          factionName: faction.factionname
        })) : []
      );
      
      if (teams.length === 0) {
        throw new Error('No kill teams found in the data');
      }

      setKillTeams(teams);
      setIsLoading(false);
    } catch (error) {
      console.error('Error details:', error);
      setError(`Error fetching kill teams: ${error.message}. Please try again later.`);
      setIsLoading(false);
    }
  };

  const handleTeamSelect = (event) => {
    const teamName = event.target.value;
    const team = killTeams.find(kt => kt.killteamname === teamName);
    setSelectedTeam(team);
    
    if (team) {
      const teamOperatives = team.fireteams.flatMap(fireteam => 
        fireteam.operatives.map(op => ({
          name: op.opname,
          stats: {
            M: replaceShapeTokens(op.M), // Apply shape replacement here
            APL: op.APL,
            GA: op.GA,
            DF: op.DF,
            SV: op.SV,
            W: op.W,
          },
          weapons: op.weapons.flatMap(weapon => 
            weapon.profiles.map(profile => ({
              name: `${weaponIcons[weapon.weptype] || ''} ${weapon.wepname}${profile.name ? ` - ${profile.name}` : ''}`,
              checked: true
            }))
          ),
          checked: true
        }))
      );
      setOperatives(teamOperatives);
    } else {
      setOperatives([]);
    }
  };

  const toggleOperative = (index) => {
    setOperatives(ops => ops.map((op, i) => 
      i === index ? { ...op, checked: !op.checked } : op
    ));
  };

  const toggleWeapon = (opIndex, weaponIndex) => {
    setOperatives(ops => ops.map((op, i) => 
      i === opIndex ? {
        ...op,
        weapons: op.weapons.map((w, j) => 
          j === weaponIndex ? { ...w, checked: !w.checked } : w
        )
      } : op
    ));
  };

  if (isLoading) return <div className="loading-screen">Loading kill teams...</div>;
  if (error) return (
    <div className="error-screen">
      <p className="error-message">{error}</p>
      <button onClick={fetchKillTeams} className="retry-button">Try Again</button>
    </div>
  );

  return (
    <div className="container">
      <div className="top-bar">
        <h1>ServoSummary-KT</h1>
        <select
          onChange={handleTeamSelect}
          defaultValue=""
          className="team-selector"
        >
          <option value="">Select a Kill Team</option>
          {killTeams.map(team => (
            <option key={team.killteamname} value={team.killteamname}>
              {team.factionName} - {team.killteamname}
            </option>
          ))}
        </select>
      </div>
      <div className="main-content">
        {selectedTeam && (
          <table className="operative-table">
            <thead>
              <tr>
                <th>Operative</th>
                <th>Weapons</th>
              </tr>
            </thead>
            <tbody>
              {operatives.map((operative, opIndex) => (
                <tr key={opIndex}>
                  <td>
                    <div className="operative-info">
                      <input
                        type="checkbox"
                        checked={operative.checked}
                        onChange={() => toggleOperative(opIndex)}
                        className="checkbox"
                      />
                      <span>{operative.name}</span>
                    </div>
                    <OperativeStats stats={operative.stats} />
                  </td>
                  <td>
                    <div className="weapon-grid">
                      {operative.weapons.map((weapon, weaponIndex) => (
                        <div key={weaponIndex} className="weapon-item">
                          <input
                            type="checkbox"
                            checked={weapon.checked}
                            onChange={() => toggleWeapon(opIndex, weaponIndex)}
                            className="checkbox"
                          />
                          <span>{weapon.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KillTeamSelector;
