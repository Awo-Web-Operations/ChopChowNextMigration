import React, { useState } from 'react';
import Select from 'react-select';
import styles from './select.module.css'

const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: '#6D6D6D;',
    fontSize: '15px',
    fontWeight: '200',
    marginTop: '1.2rem',
    marginBottom: '1.2rem',
    backgroundColor: state.isSelected ? "#FFFFFF" : "#FFFFFF",
    placeholder: (base) => ({
      ...base,
      className: 'placeholder',
    }),
  }),

  control: (defaultStyles, state) => ({
    ...defaultStyles,
    borderRadius: '4px',
    outline: state.isFocused ? '1px solid rgba(4, 213, 5, 0.90)' : '1px solid rgba(4, 213, 5, 0.10)',
    border: state.isFocused ? '2px ' : '1px solid rgba(4, 213, 5, 0.60)',
    borderColor: state.isSelected ? '1px solid rgba(4, 213, 5, 0.90)' : '1px solid rgba(4, 213, 5, 0.60)',
    height: '51px',
    color: '#6D6D6D;',
    textAlign: 'justify',
    paddingLeft: '.5rem',
    "&:hover": {
      borderColor: '1px solid rgba(4, 213, 5, 0.60)',
    },

  }),
  // singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
};

export const DropDownSelect = ({ placeholder, onSelect, onChange, options, formatOptionLabel, noOptionsMessage, onMenuScrollToBottom }) => {

  return (
    <div className="App">
      <Select
        onMenuScrollToBottom={onMenuScrollToBottom}
        placeholder={placeholder}
        className='custom'
        onInputChange={(e) => onChange(e)}
        options={options}
        styles={customStyles}
        maxMenuHeight={'23rem'}
        onChange={(e) => onSelect(e)}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={noOptionsMessage}
      />
    </div>
  );
}