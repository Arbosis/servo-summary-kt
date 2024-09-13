//import React from 'react';

const generateSummaryHTML = (operatives, stratPloys, tacPloys) => {  
    let summaryHTML = `
      <html>
        <head>
          <title>Kill Team Summary</title>
          <link rel="stylesheet" type="text/css" href="${process.env.PUBLIC_URL}/summaryStyles.css">
          <style>
            /* Additional inline styles if needed */
          </style>
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
          <table class="weapon">
            <tbody>
              <tr>
                <th class="name">Name</th>
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
          <table class="abilityList">
            <tbody>
              <tr>
                <th class="name" colspan="2">Unique Abilities</th>
              </tr>
              ${operative.abilities
                .map(ability => `
                  <tr>
                    <td class="name">${ability.name}</td>
                    <td class="desc">${ability.description}</td>
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
    <table class="abilityList">
      <tbody>
        <tr>
          <th class="name">Strategic Ploys</th>
          <th class="desc">Description</th>
        </tr>
        ${stratPloys.map(p => `
          <tr>
            <td class="name">${p.name} (${p.CP} CP)</td>
            <td class="desc">${p.description}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <table class="abilityList">
      <tbody>
        <tr>
          <th class="name">Tactical Ploys</th>
          <th class="desc">Description</th>
        </tr>
        ${tacPloys.map(p => `
          <tr>
            <td class="name">${p.name} (${p.CP} CP)</td>
            <td class="desc">${p.description}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    `;

    return tableHTML;
  };

  export default generateSummaryHTML;