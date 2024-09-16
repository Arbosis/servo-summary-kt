import React, { useState } from 'react';
import { useKillTeams } from './useKillTeams'; // Custom hook for fetching kill teams
import RenderOperative from './RenderOperative'; 
import PloysTable from './PloysTable';
import SummaryHTML from './SummaryHTML';

// Weapon icons
const weaponIcons = {
  M: '⚔️',
  R: "🔫",
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
              name: `${weaponIcons[weapon.weptype] || ''} ${weapon.wepname}${profile.name ? ` (${profile.name})` : ''}`,
              stats: {
                A: profile.A,
                BS: profile.BS,
                D: profile.D,
                SR: replaceShapeTokens(profile.SR),
                type: weapon.weptype,
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
          <h1 className="app-title">ServoSummary</h1>
          <div className="controls">
            <select onChange={handleKillTeamSelection} className="team-selector">
              <option value="">Select a Kill Team</option>
              {killTeams.map(team => (
                <option key={team.killteamname} value={team.killteamname}>
                  {team.factionName} - {team.killteamname}
                </option>
              ))}
            </select>
            <div className='generateMenu'>
            {selectedTeam && (
              <>
                Generate summary:
                <button onClick={openSummaryNewTab} className="generate-summary-button">
                  Web
                </button>
                <button onClick={PrintAsPDF} className="generate-summary-button">
                  PDF
                </button>
              </>
            )}
            </div>
          </div>
        </div> 
    );
  }

  const [showPreview, setShowPreview] = useState(false);

  const teamToolbar = () => {
    const toggleShowPreview = () => setShowPreview(!showPreview);

    return (
      <div className="teamToolbar">
        <span>
          Editor
          <label className="switch">
            <input type="checkbox" checked={showPreview} onChange={toggleShowPreview} />
            <span className="slider round"></span>
          </label>
          Preview
        </span>
        {/* <span>
          Generate summary:
          <button onClick={openSummaryNewTab} className="generate-summary-button">
            Web
          </button>
          <button onClick={PrintAsPDF} className="generate-summary-button">
            PDF
          </button>
        </span> */}
      </div>
    );
  }

  const teamEditor = () => {
    return (
      <>
        <div className="teamEditor">
          {operatives.map((operative, opIndex) => (
            <RenderOperative
              key={opIndex}
              operative={operative}
              toggleOperative={() => toggleOperativeSelection(opIndex)}
              toggleWeapon={(weaponIndex) => toggleWeaponSelection(opIndex, weaponIndex)}
              toggleOpAbility={(abilityIndex) => toggleOpAbilitySelection(opIndex, abilityIndex)}
            />
          ))}
            
          <PloysTable ploys={stratPloys} tableName="Strat Ploys"/>
          <PloysTable ploys={tacPloys} tableName="Tac Ploys"/>
        </div>
        </>
    );
  };

  const showSummaryPreview = (operatives, stratPloys, tacPloys) => (
    <iframe
      className="teamSummary"
      srcDoc={SummaryHTML(operatives, stratPloys, tacPloys)}
      frameBorder="0"
      scrolling="no"
      style={{ width: '100%', height: '100vh' }}
    />
  );

  if (isLoading) return <div>Loading kill teams...</div>;
  if (error) return <div>{error}</div>;

  /* RETURN: RENDER CONTENT */ 
  return (
    <div className="container">
      {TopBar()}
      {selectedTeam && (
        <>
          {teamToolbar()}

          {showPreview ? (
            showSummaryPreview(operatives, stratPloys, tacPloys)
          ) : (
            teamEditor()
          )}
        </>
      )}

    </div>
  );

};


export default KillTeamSelector;




