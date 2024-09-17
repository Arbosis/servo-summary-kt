const SummaryHTMLv2 = (operatives, stratPloys, tacPloys) => {
    let summaryHTML = `
      <html>
        <head>
          <title>Kill Team Summary</title>
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
          </div>
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

          ${weapons.length ? `
          <div class="weapon-table">
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>ATK</th>
                        <th>HIT</th>
                        <th>DMG</th>
                        <th>WR</th>
                    </tr>
                </thead>
                <tbody>
                    ${weapons
                      .map(
                        weapon => `
                          <tr>
                            <td>${weapon.name}</td>
                            <td>${weapon.stats.A}</td>
                            <td>${weapon.stats.BS}</td>
                            <td>${weapon.stats.D}</td>
                            <td>${weapon.stats.SR}</td>
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
            <h3>Abilities</h3>
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
              <td><span class="abilityName">${p.name} (${p.CP} CP)</span> ${p.description}</td>
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
              <td><span class="abilityName">${p.name} (${p.CP} CP)</span> ${p.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  };

  export default SummaryHTMLv2;