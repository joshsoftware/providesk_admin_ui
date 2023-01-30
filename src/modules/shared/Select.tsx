import {
  Box,
  Select as MUISelect,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { StyledErrorText } from './StyledErrorText';
import TickIcon from '@mui/icons-material/Done';
import { palette } from 'theme';

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

export const MultiSelect = ({
  options,
  value = [],
  error,
  onChange,
  onChipClick,
  label,
  name,
  onBlur,
  sx,
  disabled,
}: MUISelectProps) => {
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
  const optionLabelsByValue = useMemo(() => {
    return selectOptions.reduce(
      (map: { [key: string]: string }, opt: SelectOpt) => {
        map[opt.value] = opt.label;
        return map;
      },
      {}
    );
  }, [selectOptions]);
  const handleDelete = (deletedValue: string) => {
    const updatedValue = (value as string[]).filter(
      (option) => option !== deletedValue
    );
    onChange(updatedValue);
    // setValueToDelete(null);
  };

  const renderValue = (selected: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {selected.length > 0 &&
        selected.map((value) => {
          return (
            <Chip
              key={value}
              label={optionLabelsByValue[value]}
              onClick={
                onChipClick
                  ? () => onChipClick(value, optionLabelsByValue[value])
                  : () => {}
              }
              onMouseDown={(e) => e.stopPropagation()}
              onDelete={() => handleDelete(value)}
            />
          );
        })}
    </Box>
  );

  return (
    <>
      <Box sx={{ width: '100%', ...sx }}>
        <FormControl size='small' fullWidth>
          <InputLabel>{label}</InputLabel>
          <MUISelect
            value={value as string[]}
            label={label}
            name={name}
            onChange={(e) => {
              onChange(e.target.value as string[]);
            }}
            onBlur={onBlur}
            multiple
            renderValue={renderValue}
            error={Boolean(error ? error : false)}
            disabled={disabled}
            sx={{
              ...sx,
            }}
          >
            {selectOptions.length > 0 ? (
              selectOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled ? opt.disabled : false}
                >
                  <TickIcon
                    sx={{
                      opacity: value.includes(opt.value as string) ? 1 : 0,
                    }}
                    fontSize='small'
                  />
                  <Typography px={1}>{opt.label}</Typography>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Data</MenuItem>
            )}
          </MUISelect>
          {error && <StyledErrorText text={error as string} />}
        </FormControl>
      </Box>
    </>
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
export interface MUISelectProps {
  options: SelectOpt[] | string[];
  onChange: (event: string[]) => void;
  onChipClick?: (key: string, label: string) => void;
  value: string[];
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
  disabled?: boolean;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  name,
  disabled,
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
      disabled={disabled}
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
