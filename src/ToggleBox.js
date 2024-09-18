import React from 'react';

const ToggleBox = ({ text1, text2, onChangeHandle }) => {
    return (
        <>
        <input type="checkbox" onChange={onChangeHandle} id="toggle" className="toggleCheckbox" />
            <label htmlFor="toggle" className='toggleContainer'>
            <div>{text1}</div>
            <div>{text2}</div>
        </label>
        </>
    );
};

export default ToggleBox;