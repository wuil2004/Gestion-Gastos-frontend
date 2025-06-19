import React from 'react';

const InputForm = ({ 
  type, 
  placeHolder, 
  isRequired, 
  value, 
  onChange, 
  onBlur,
  name 
}) => {
  return (
    <input
      className="w-full focus:outline-none placeholder:text-slate-100 p-2 border-b-2 bg-transparent text-white"
      onChange={onChange}
      onBlur={onBlur}
      type={type}
      name={name}
      placeholder={placeHolder}
      required={isRequired}
      value={value}
    />
  );
};

export default InputForm;