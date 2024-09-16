import React from 'react';

const ToggleBox = ({ text1, text2, onChangeHandle }) => {
    return (
        <>
        <input type="checkbox" onChange={onChangeHandle} id="toggle" class="toggleCheckbox" />
            <label for="toggle" class='toggleContainer'>
            <div>{text1}</div>
            <div>{text2}</div>
        </label>
        </>
    );
};

export default ToggleBox;