import {
  Box,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { StyledErrorText } from './StyledErrorText';

export const Select = ({
  options,
  value,
  error,
  onChange,
  label,
  name,
  onBlur,
  sx,
  disabled,
}: SelectProps) => {
  const selectOptions: SelectOpt[] = useMemo(
    () =>
      options.map((opt) => {
        if (typeof opt === 'string') {
          return { label: opt, value: opt };
        }
        return opt;
      }),
    [options]
  );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <FormControl size='small' fullWidth>
        <InputLabel>{label}</InputLabel>
        <MUISelect
          value={value as string}
          label={label}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          error={Boolean(error ? error : false)}
          disabled={disabled}
        >
          {selectOptions.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled ? opt.disabled : false}
            >
              {opt.label}
            </MenuItem>
          ))}
        </MUISelect>
        {error && <StyledErrorText text={error as string} />}
      </FormControl>
    </Box>
  );
};

export interface SelectProps {
  options: SelectOpt[] | string[];
  onChange: (event: SelectChangeEvent<string>) => void;
  value: string | number;
  label: string;
  name?: string;
  error?: string | boolean;
  helperText?: string | ReactNode;
  required?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium' | undefined;
  sx?: any;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onBlur?: (e: any) => void;
}
export interface SelectOpt {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectOption {
  label: string;
  value: string;
}

interface ISelectProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: SelectOption[];
  name: string;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  name,
}: ISelectProps) => {
  return (
    <TextField
      id='outlined-select-currency'
      select
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      size='small'
      fullWidth
    >
      {options.map((option: SelectOption) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Select;
