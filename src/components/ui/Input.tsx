import React, { forwardRef, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputProps as MuiInputProps,
  FormControlProps,
  InputBaseProps,
} from '@mui/material';
import { useField } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

type InputVariant = 'outlined' | 'standard' | 'filled';
type InputSize = 'small' | 'medium';

interface InputProps extends Omit<MuiInputProps, 'size' | 'color' | 'error'> {
  name: string;
  label?: string;
  helperText?: string;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number | string;
  maxRows?: number | string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  error?: boolean;
  formControlProps?: FormControlProps;
  inputProps?: InputBaseProps['inputProps'];
  showPasswordToggle?: boolean;
  loading?: boolean;
  type?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => !['fullWidth', 'size'].includes(prop as string),
})<{ fullWidth?: boolean; size?: InputSize }>(({ theme, fullWidth, size }) => ({
  width: fullWidth ? '100%' : 'auto',
  margin: theme.spacing(1, 0, 2, 0),
  '& .MuiFormLabel-root': {
    transform: 'translate(14px, 14px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-error': {
      '& fieldset': {
        borderColor: theme.palette.error.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.error.main,
      },
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      '& fieldset': {
        borderColor: theme.palette.action.disabled,
      },
    },
  },
  ...(size === 'small' && {
    '& .MuiOutlinedInput-root': {
      height: 40,
    },
  }),
  ...(size === 'medium' && {
    '& .MuiOutlinedInput-root': {
      height: 48,
    },
  }),
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '&.Mui-error': {
    color: theme.palette.error.main,
  },
}));

const StyledHelperText = styled(FormHelperText)(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0, 0),
  color: theme.palette.text.secondary,
  '&.Mui-error': {
    color: theme.palette.error.main,
  },
}));

const Input = forwardRef<HTMLInputElement, InputProps>(({
  name,
  label,
  helperText,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  multiline = false,
  rows,
  maxRows,
  startAdornment,
  endAdornment,
  error: propError = false,
  formControlProps = {},
  inputProps = {},
  showPasswordToggle = false,
  loading = false,
  type = 'text',
  color,
  disabled,
  ...props
}, ref) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = (meta.touched && !!meta.error) || propError;
  const errorText = meta.touched && meta.error ? meta.error : '';
  const displayHelperText = hasError ? errorText : helperText;
  const disabledState = disabled || loading;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const renderEndAdornment = () => {
    if (showPasswordToggle && type === 'password') {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
            size={size}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }
    return endAdornment || null;
  };

  return (
    <StyledFormControl
      variant={variant as 'outlined' | 'standard' | 'filled'}
      fullWidth={fullWidth}
      error={hasError}
      disabled={disabledState}
      size={size}
      {...formControlProps}
    >
      {label && (
        <StyledInputLabel
          htmlFor={name}
          shrink={!!field.value || undefined}
          error={hasError}
        >
          {label}
        </StyledInputLabel>
      )}
      <OutlinedInput
        id={name}
        name={field.name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={field.onChange}
        type={inputType}
        size={size as 'small' | 'medium'}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows ? Number(rows) : undefined}
        maxRows={maxRows ? Number(maxRows) : undefined}
        error={hasError}
        startAdornment={startAdornment}
        endAdornment={renderEndAdornment()}
        inputProps={{
          'aria-invalid': hasError,
          'aria-errormessage': hasError ? `${name}-helper-text` : undefined,
          ...inputProps,
        }}
        inputRef={ref}
        {...props}
        color={color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined}
      />
      {displayHelperText && (
        <StyledHelperText 
          id={`${name}-helper-text`}
          error={hasError}
        >
          {displayHelperText}
        </StyledHelperText>
      )}
    </StyledFormControl>
  );
});

Input.displayName = 'Input';

export default Input;
