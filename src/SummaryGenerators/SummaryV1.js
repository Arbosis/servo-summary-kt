const SummaryHTMLv1 = (operatives, stratPloys, tacPloys) => {
    let summaryHTML = `
      <html>
        <head>
          <title>Kill Team Summary</title>
          <link rel="stylesheet" type="text/css" href="${process.env.PUBLIC_URL}/summaryStyles.css">
        </head>
        <body>
          ${generateOperativesTable(operatives, stratPloys, tacPloys)}
        </body>
      </html>
    `;
  
    return summaryHTML;
  };
  
  const generateOperativesTable = (operatives, stratPloys, tacPloys) => {
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
          ${operative.weapons.some(weapon => weapon.checked) ? `
          <table class="opWeapons">
            <tbody>
              <tr>
                <th class="name">Weapon</th>
                <th class="bs">Skill</th>
                <th class="attack">A</th>
                <th class="damage">D</th>
                <th class="rules">SR</th>
              </tr>
              ${operative.weapons
                .filter(weapon => weapon.checked)
                .map(weapon => `
                  <tr>
                    <td class="name">${weapon.name}</td>
                    <td class="bs">${weapon.stats.BS}</td>
                    <td class="attack">${weapon.stats.A}</td>
                    <td class="damage">${weapon.stats.D}</td>
                    <td class="rules">${weapon.stats.SR}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          ` : ``}
          ${operative.abilities.length ? `
          <table class="opAbilities">
            <tbody>
              <tr>
                <th class="name">Unique Abilities</th>
              </tr>
              ${operative.abilities
                .filter(ability => ability.checked)
                .map(ability => `
                  <tr>
                    <td><span class="abilityName">${ability.title}</span>  ${ability.description}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          ` : ''}
        </div>
        `;
      }
    });
  
    tableHTML += `
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
            <th class="name">Tactical Ploys</th>
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
  
    return tableHTML;
  };

  export default SummaryHTMLv1;