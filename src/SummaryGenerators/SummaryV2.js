const SummaryHTMLv2 = (operatives, stratPloys, tacPloys) => {
    let summaryHTML = `
      <html>
        <head>
          <title>Kill Team Summary</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" type="text/css" href="${process.env.PUBLIC_URL}/summaryV2.css">
        </head>
        <body>
          ${generateOperativesTable(operatives, stratPloys, tacPloys)}
          ${generatePloysTable(stratPloys, tacPloys)}
        </body>
      </html>
    `;
  
    return summaryHTML;
  };
  

  const generateOperativesTable = (operatives, stratPloys, tacPloys) => {
    let tableHTML = ``;
  
    tableHTML = operatives
      .filter(op => op.checked)
      .map(op => ({
        op,
        weapons: op.weapons.filter(w => w.checked),
        abilities: op.abilities.filter(a => a.checked),
      }))
      .map(
        ({ op, weapons, abilities }) => `
        <div class="Card">

          <div class="card-header">
            <h1 class="operative-name">${op.name}</h1>
          
            <div class="card-stats">
                <div class="stat">
                    <span class="stat-title">APL</span>
                    <span class="stat-value">${op.stats.APL}</span>
                </div>
                <div class="stat">
                    <span class="stat-title">MOVE</span>
                    <span class="stat-value">${op.stats.M}</span>
                </div>
                <div class="stat">
                    <span class="stat-title">SAVE</span>
                    <span class="stat-value">${op.stats.SV}</span>
                </div>
                <div class="stat">
                    <span class="stat-title">WOUNDS</span>
                    <span class="stat-value">${op.stats.W}</span>
                </div>
            </div>
          </div>

          ${weapons.length ? `
          <div class="weapon-table">
            <table>
                <thead>
                    <tr>
                        <th class="name">NAME</th>
                        <th class="atk">ATK</th>
                        <th class="hit">HIT</th>
                        <th class="dmg">DMG</th>
                        <th class="wr">WR</th>
                    </tr>
                </thead>
                <tbody>
                    ${weapons
                      .map(
                        weapon => `
                          <tr>
                            <td class="name">${weapon.name}</td>
                            <td class="atk">${weapon.stats.A}</td>
                            <td class="hit">${weapon.stats.BS}</td>
                            <td class="dmg">${weapon.stats.D}</td>
                            <td class="wr">${weapon.stats.SR}</td>
                          </tr>
                        `
                      )
                      .join('')}
                </tbody>
            </table>
          </div>
          ` : ``}

          ${abilities.length ? `
          <div class="abilities">
            ${abilities
              .map(
                ability => `
                  <p><strong>${ability.title}:</strong> ${ability.description}</p>
                `
              )
              .join('')}
          </div>
          ` : ''}
        </div>
        `
      )
      .join('');
    
    return tableHTML;
  };

const generatePloysTable = (stratPloys, tacPloys) => {
  return `
    <div class="abilityList">
      <table>
        <tbody>
          <tr>
            <th class="name">Strategic Ploys</th>
          </tr>
          ${stratPloys.map(p => `
            <tr>
              <td><strong>${p.name} (${p.CP} CP)</strong> ${p.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>  
  
    <div class="abilityList">
      <table>
        <tbody>
          <tr>
            <th class="name">Ploys</th>
          </tr>
          ${tacPloys.map(p => `
            <tr>
              <td><strong>${p.name} (${p.CP} CP)</strong> ${p.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  };

  export default SummaryHTMLv2;