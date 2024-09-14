import React, { useState } from 'react';
import { useKillTeams } from './useKillTeams'; // Custom hook for fetching kill teams
import RenderOperative from './RenderOperative'; 
import PloysTable from './PloysTable';
import SummaryHTML from './SummaryHTML';

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
  const [stratPloys, setStratPloys] = useState([]);
  const [tacPloys, setTacPloys] = useState([]);

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
                SR: replaceShapeTokens(profile.SR),
              },
              checked: weapon.isdefault === 1
            }))
          ),
          abilities: op.abilities.map(ability => ({
            title: ability.title,
            description: ability.description,
            checked: true
          })) || [],
          checked: true
        }))
      );
      const stratPloys = team.ploys.strat.map(p => ({
        name: p.ployname,
        CP: p.CP,
        description: replaceShapeTokens(p.description)
      }));
      const tacPloys = team.ploys.tac.map(p => ({
        name: p.ployname,
        CP: p.CP,
        description: replaceShapeTokens(p.description)
      }));
      setOperatives(teamOperatives);
      setStratPloys(stratPloys);
      setTacPloys(tacPloys);
    } else {
      setOperatives([]);
      setStratPloys([]);
      setTacPloys([]);
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

  const toggleOpAbilitySelection = (opIndex, abilityIndex) => {
    setOperatives(ops => ops.map((op, i) => i === opIndex ? {
      ...op,
      abilities: op.abilities.map((w, j) => j === abilityIndex ? { ...w, checked: !w.checked } : w)
    } : op));
  };

  const PrintAsPDF = () => {
    // Create an iframe element
    const iframe = document.createElement('iframe');
    
    // Set iframe to be invisible
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    
    // Append iframe to the document body
    document.body.appendChild(iframe);

    // Write the HTML content to the iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(SummaryHTML(operatives, stratPloys, tacPloys));
    iframe.contentWindow.document.close();

    // Wait for the iframe content to load, then print
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);  // Clean up iframe after printing
    }, 50);
};

  const openSummaryNewTab = () => {
    if (!selectedTeam) return;
  
    const summaryWindow = window.open('', '_blank');
    // summaryWindow.document.write(generateSummaryHTML());
    summaryWindow.document.write(SummaryHTML(operatives, stratPloys, tacPloys));
    summaryWindow.document.close();
  };

  const TopBar = () => {
    return (
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
              <button onClick={openSummaryNewTab} className="generate-summary-button">
                Web Summary
              </button>
            )}
            {selectedTeam && (
              <button onClick={PrintAsPDF} className="generate-summary-button">
                PDF Summary
              </button>
            )}
          </div>
        </div> 
    );
  }

  const teamEditor = () => {
    return (
      <>
          <table className="operative-table">
            <thead>
              <tr><th>Operative</th><th>Weapons</th></tr>
            </thead>
            <tbody>
              {operatives.map((operative, opIndex) => (
                <RenderOperative
                  key={opIndex}
                  operative={operative}
                  toggleOperative={() => toggleOperativeSelection(opIndex)}
                  toggleWeapon={(weaponIndex) => toggleWeaponSelection(opIndex, weaponIndex)}
                  toggleOpAbility={(abilityIndex) => toggleOpAbilitySelection(opIndex, abilityIndex)}
                />
              ))}
            </tbody>
          </table>
          
          <PloysTable ploys={stratPloys} tableName="Strat Ploys"/>
          <PloysTable ploys={tacPloys} tableName="Tac Ploys"/>
        </>
    );
  }

  if (isLoading) return <div>Loading kill teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <TopBar />
      
      {selectedTeam && ( teamEditor() )}

    </div>
  );
};

export default KillTeamSelector;
