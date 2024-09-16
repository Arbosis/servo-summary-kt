import React from 'react';

const weaponTypeIcon = (type) => {
  if (type === 'R') {
    return "[R]";//<img src="/icon_crosshair.png" alt="Ranged" className="icon" />;
  } else if (type === 'M') {
    return "[M]";//<img src="./icon_melee.png" alt="Melee" className="icon" />;
  }
  return null;
};

const OperativeNameAndStats = ({ operative, toggleOperative }) => {
  return (
      <table className="operative-stats">
        <tbody>
          <tr>
            <th rowSpan="2" className="name">
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
        </tbody>
      </table>
  );
};

const RenderOperative = ({ operative, toggleOperative, toggleWeapon, toggleOpAbility }) => {
  return (
    <React.Fragment>
      <div className='editorOperative'>

        {/* op name and stats */}
        <OperativeNameAndStats operative={operative} toggleOperative={toggleOperative} />

        {/* op weapons */}
        <div className="weapon-grid">
          {operative.weapons.map((weapon, weaponIndex) => (
            <div key={weaponIndex} className="weapon-item">
              <input type="checkbox" checked={weapon.checked} onChange={() => toggleWeapon(weaponIndex)} className="checkbox" />
              <span>
                {weaponTypeIcon(weapon.type)}
                {weapon.name}
              </span>
            </div>
          ))}
        </div>

        {/* op abilities */}
        <div className="weapon-grid">
          {operative.abilities.map((ability, abilityIndex) => (
            <div key={abilityIndex} className="weapon-item">
              <input
                type="checkbox"
                checked={ability.checked}
                onChange={() => toggleOpAbility(abilityIndex)}
                className="checkbox"
              />
              <span>[UA]{ability.title}</span>
            </div>
          ))}
        </div>

      </div>
    </React.Fragment>
  );
};

export default RenderOperative;

