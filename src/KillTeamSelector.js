// KillTeamSelector.js
import React, { useState, useEffect } from 'react';
import OperativeStats from './OperativeStats';

// Utility function to replace placeholders with Unicode symbols
const replaceSymbols = (text) => {
  return text
    .replace(/\[CIRCLE\]/g, '○')
    .replace(/\[SQUARE\]/g, '◻')
    .replace(/\[TRIANGLE\]/g, '△')
    .replace(/\[PENT\]/g, '⬠');
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
            M: replaceSymbols(op.M),
            APL: op.APL,
            GA: op.GA,
            DF: op.DF,
            SV: op.SV,
            W: op.W,
          },
          weapons: op.weapons.flatMap(weapon => 
            weapon.profiles.map(profile => ({
              name: replaceSymbols(`${weapon.wepname}${profile.name ? ` - ${profile.name}` : ''}`),
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

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading kill teams...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchKillTeams} className="bg-blue-500 text-white px-4 py-2 rounded">Try Again</button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="top-bar bg-gray-800 text-white p-4 flex items-center space-x-4">
        <h1 className="text-xl font-bold">ServoSummary-KT</h1>
        <select
          onChange={handleTeamSelect}
          defaultValue=""
          className="bg-white text-black p-2 rounded"
        >
          <option value="">Select a Kill Team</option>
          {killTeams.map(team => (
            <option key={team.killteamname} value={team.killteamname}>
              {team.factionName} - {team.killteamname}
            </option>
          ))}
        </select>
      </div>
      <div className="main-content p-6 overflow-auto">
        {selectedTeam && (
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left w-1/2">Operative</th>
                <th className="border p-2 text-left w-1/2">Weapons</th>
              </tr>
            </thead>
            <tbody>
              {operatives.map((operative, opIndex) => (
                <tr key={opIndex} className="border-b hover:bg-gray-50">
                  <td className="border p-2 align-top">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={operative.checked}
                        onChange={() => toggleOperative(opIndex)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{operative.name}</span>
                    </div>
                    {/* Render operative stats here */}
                    <OperativeStats stats={operative.stats} />
                  </td>
                  <td className="border p-2">
                    <table className="w-full">
                      <tbody>
                        {operative.weapons.map((weapon, weaponIndex) => (
                          <tr key={weaponIndex}>
                            <td className="p-1">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={weapon.checked}
                                  onChange={() => toggleWeapon(opIndex, weaponIndex)}
                                  className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span>{weapon.name}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
