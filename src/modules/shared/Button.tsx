import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
} from '@mui/material';

export const Button = ({
  isLoading,
  disabled,
  sx,
  ...props
}: CustomButtonProps) => {
  return (
    <MUIButton
      {...props}
      variant={props.variant || 'contained'}
      disabled={isLoading || disabled}
      sx={{ px: 3, py: 1, ...sx }}
    >
      {props.children}
      {isLoading && (
        <CircularProgress color='inherit' sx={{ ml: 1 }} size={12} />
      )}
    </MUIButton>
  );
};

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
  component?: string;
}
