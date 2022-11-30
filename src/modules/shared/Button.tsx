import {
  Button as MUIButton,
  ButtonProps,
  CircularProgress,
} from '@mui/material';

const outlinedDisabledStyles = { opacity: 0.7, color: 'secondary.main' };
const containedDisabledStyles = {
  bgcolor: 'neutral.disabled',
  color: 'neutral.white',
};

export const Button = ({
  isLoading,
  sx,
  disabled,

  ...props
}: CustomButtonProps) => {
  return (
    <MUIButton
      color='primary'
      {...props}
      sx={{
        textTransform: 'none',
        fontWeight: '700',
        fontSize: '14px',
        height: '40px',
        '&:disabled':
          props.variant && props.variant === 'outlined'
            ? outlinedDisabledStyles
            : containedDisabledStyles,
        ...sx,
      }}
      variant={props.variant || 'contained'}
      disabled={isLoading || disabled}
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
