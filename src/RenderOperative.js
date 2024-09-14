import React from 'react';
//import OperativeStats from './OperativeStats'; // Import the OperativeStats component

// const RenderOperative = ({ operative, toggleOperative, toggleWeapon, toggleOpAbility }) => {
//   return (
//     <React.Fragment>
//       <tr>
//         <td style={{ flex: '0 0 content' }}>
//           <div className="operative-name">
//             <input
//               type="checkbox"
//               checked={operative.checked}
//               onChange={toggleOperative}
//               className="checkbox"
//             />
//             <span>{operative.name}</span>
//             <OperativeStats stats={operative.stats} />
//           </div>
//         </td>
//         <td style={{width: '100%' }}>
//           <div className="weapon-grid">
//             {operative.weapons.map((weapon, weaponIndex) => (
//               <div key={weaponIndex} className="weapon-item">
//                 <input
//                   type="checkbox"
//                   checked={weapon.checked}
//                   onChange={() => toggleWeapon(weaponIndex)}
//                   className="checkbox"
//                 />
//                 <span>{weapon.name}</span>
//               </div>
//             ))}
//             {operative.abilities.map((ability, abilityIndex) => (
//               <div key={abilityIndex} className="weapon-item">
//                 <input
//                   type="checkbox"
//                   checked={ability.checked}
//                   onChange={() => toggleOpAbility(abilityIndex)}
//                   className="checkbox"
//                 />
//                 <span>{ability.title}</span>
//               </div>
//             ))}
//           </div>

//         </td>
//       </tr>
//     </React.Fragment>
//   );
// };

const OperativeStats = ({ stats }) => {
  return (
      <table class="operative-stats">
        <thead>
          <tr>
            <th>M</th>
            <th>APL</th>
            <th>GA</th>
            <th>Df</th>
            <th>Sv</th>
            <th>W</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stats.M}</td>
            <td>{stats.APL}</td>
            <td>{stats.GA}</td>
            <td>{stats.DF}</td>
            <td>{stats.SV}</td>
            <td>{stats.W}</td>
          </tr>
        </tbody>
      </table>
  );
};

const OperativeNameAndStats = ({ operative, toggleOperative }) => {
  return (
      <table class="operative-stats">
          <tr>
            <th rowspan="2" class="name">
              <input type="checkbox" checked={operative.checked} onChange={toggleOperative} className="checkbox" />
              {operative.name}
            </th>
            <th>M</th>
            <th>APL</th>
            <th>GA</th>
            <th>Df</th>
            <th>Sv</th>
            <th>W</th>
          </tr>

          <tr>
            <td>{operative.stats.M}</td>
            <td>{operative.stats.APL}</td>
            <td>{operative.stats.GA}</td>
            <td>{operative.stats.DF}</td>
            <td>{operative.stats.SV}</td>
            <td>{operative.stats.W}</td>
          </tr>

      </table>
  );
};

const RenderOperative = ({ operative, toggleOperative, toggleWeapon, toggleOpAbility }) => {
  return (
    <React.Fragment>
      <div class='editorOperative'>

        <OperativeNameAndStats operative={operative} toggleOperative={toggleOperative} />

        <div className="weapon-grid">
          {operative.weapons.map((weapon, weaponIndex) => (
            <div key={weaponIndex} className="weapon-item">
              <input type="checkbox" checked={weapon.checked} onChange={() => toggleWeapon(weaponIndex)} className="checkbox" />
              <span>{weapon.name}</span>
            </div>
          ))}
        </div>

        <div className="weapon-grid">
          {operative.abilities.map((ability, abilityIndex) => (
            <div key={abilityIndex} className="weapon-item">
              <input
                type="checkbox"
                checked={ability.checked}
                onChange={() => toggleOpAbility(abilityIndex)}
                className="checkbox"
              />
              <span>{ability.title}</span>
            </div>
          ))}
        </div>

      </div>
    </React.Fragment>
  );
};

export default RenderOperative;
