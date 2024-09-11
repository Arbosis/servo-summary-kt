import React from 'react';
import OperativeStats from './OperativeStats'; // Import the OperativeStats component

const OperativeRow = ({ operative, toggleOperative, toggleWeapon }) => {
  return (
    <tr>
      <td>
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
      <td>
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
        </div>
      </td>
    </tr>
  );
};

export default OperativeRow;
