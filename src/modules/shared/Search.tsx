import React from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
interface SearchProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?:string
}

const Search = ({ label, name, value, onChange ,placeholder}: SearchProps) => {
  return (
    <>
    
    <TextField label={label} name={name} value={value} onChange={onChange} size="small" placeholder={placeholder} multiline
     InputProps={{
     endAdornment:<InputAdornment position="end"><SearchSharpIcon></SearchSharpIcon></InputAdornment>}}
    fullWidth />
    
    
    </>
  );
};

export default Search;
