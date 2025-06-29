import React, { forwardRef } from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps,
  CircularProgress,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  to?: string;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: React.CSSProperties;
  'data-testid'?: string;
};

const StyledButton = styled(MuiButton)(({ theme }) => ({
  '&.Mui-disabled': {
    pointerEvents: 'auto',
    cursor: 'not-allowed',
  },
  '&[data-loading="true"]': {
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      visibility: 'hidden',
    },
  },
}));

const LoadingWrapper = styled('span')({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  to,
  ...props
}, ref) => {
  const buttonDisabled = disabled || loading;
  const loadingString = loading ? 'true' : undefined;

  const buttonProps = {
    ...props,
    ref,
    disabled: buttonDisabled,
    color: color as any, // Using any to avoid type issues with MUI's color prop
    variant,
    size,
    component: to ? RouterLink : 'button',
    ...(to && { to }),
  };

  return (
    <StyledButton
      {...buttonProps}
      data-loading={loadingString}
      startIcon={
        loading ? (
          <LoadingWrapper>
            <CircularProgress color="inherit" size={20} />
          </LoadingWrapper>
        ) : (
          startIcon
        )
      }
      endIcon={
        loading && !startIcon ? (
          <LoadingWrapper>
            <CircularProgress color="inherit" size={20} />
          </LoadingWrapper>
        ) : (
          endIcon
        )
      }
    >
      {loading && !startIcon && !endIcon ? (
        <span style={{ visibility: 'hidden' }}>{children}</span>
      ) : (
        children
      )}
      {loading && !startIcon && !endIcon && (
        <LoadingWrapper>
          <CircularProgress color="inherit" size={20} />
        </LoadingWrapper>
      )}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
