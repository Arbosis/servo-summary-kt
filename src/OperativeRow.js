import React from 'react';
import OperativeStats from './OperativeStats'; // Import the OperativeStats component

const OperativeRow = ({ operative, toggleOperative, toggleWeapon, toggleOpAbility }) => {
  return (
    <React.Fragment>
      <tr>
        <td style={{ flex: '0 0 content' }}>
          <div className="operative-name">
            <input
              type="checkbox"
              checked={operative.checked}
              onChange={toggleOperative}
              className="checkbox"
            />
            <span>{operative.name}</span>
          </div>
          <OperativeStats stats={operative.stats} />
        </td>
        <td style={{width: '100%' }}>
          <div className="weapon-grid">
            {operative.weapons.map((weapon, weaponIndex) => (
              <div key={weaponIndex} className="weapon-item">
                <input
                  type="checkbox"
                  checked={weapon.checked}
                  onChange={() => toggleWeapon(weaponIndex)}
                  className="checkbox"
                />
                <span>{weapon.name}</span>
              </div>
            ))}
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

        </td>
      </tr>
    </React.Fragment>
  );
};

export default OperativeRow;
