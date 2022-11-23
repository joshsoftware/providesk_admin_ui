import React from 'react';
import TextField from '@mui/material/TextField';

interface SearchProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ label, name, value, onChange }: SearchProps) => {
  return (
    <TextField label={label} name={name} value={value} onChange={onChange} size="small" fullWidth />
  );
};

export default Search;
