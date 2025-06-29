import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: Yup.boolean(),
});

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export const newPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(
      /^\+?[\d\s-]+$/,
      'Please enter a valid phone number'
    ),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),
});

export const addressValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^\+?[\d\s-]+$/,
      'Please enter a valid phone number'
    ),
  addressLine1: Yup.string()
    .required('Address line 1 is required')
    .max(100, 'Address line 1 must be less than 100 characters'),
  addressLine2: Yup.string()
    .max(100, 'Address line 2 must be less than 100 characters'),
  city: Yup.string()
    .required('City is required')
    .max(50, 'City must be less than 50 characters'),
  state: Yup.string()
    .required('State/Province/Region is required')
    .max(50, 'State/Province/Region must be less than 50 characters'),
  postalCode: Yup.string()
    .required('Postal/ZIP code is required')
    .matches(
      /^[a-zA-Z0-9\s-]+$/,
      'Please enter a valid postal/ZIP code'
    ),
  country: Yup.string()
    .required('Country is required'),
  isDefault: Yup.boolean(),
  addressType: Yup.string()
    .oneOf(['home', 'work', 'other'], 'Invalid address type')
    .required('Address type is required'),
});

export const reviewValidationSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  comment: Yup.string()
    .required('Review is required')
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  images: Yup.array()
    .of(Yup.mixed())
    .max(5, 'You can upload up to 5 images'),
});

export const checkoutValidationSchema = Yup.object().shape({
  shippingAddress: Yup.string()
    .required('Shipping address is required'),
  billingAddress: Yup.string()
    .when(['useDifferentBilling'], {
      is: (useDifferentBilling: boolean) => useDifferentBilling === true,
      then: (schema) => schema.required('Billing address is required'),
    }),
  shippingMethod: Yup.string()
    .required('Shipping method is required'),
  paymentMethod: Yup.string()
    .required('Payment method is required'),
  useDifferentBilling: Yup.boolean(),
  saveBillingAddress: Yup.boolean(),
  saveShippingAddress: Yup.boolean(),
  customerNote: Yup.string()
    .max(500, 'Note must be less than 500 characters'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

export const contactFormValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: Yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

// Product filter validation
export const productFilterValidationSchema = Yup.object().shape({
  categories: Yup.array().of(Yup.string()),
  priceRange: Yup.object().shape({
    min: Yup.number().min(0, 'Minimum price cannot be negative'),
    max: Yup.number()
      .test('is-greater', 'Maximum price must be greater than minimum price', function(value) {
        const { min } = this.parent;
        return !value || !min || value > min;
      })
  }),
  ratings: Yup.array().of(Yup.number().min(1).max(5)),
  sortBy: Yup.string().oneOf(['price', 'rating', 'createdAt', 'name']),
  sortOrder: Yup.string().oneOf(['asc', 'desc']),
  inStock: Yup.boolean(),
  onSale: Yup.boolean(),
});

// Coupon code validation
export const couponValidationSchema = Yup.object().shape({
  code: Yup.string()
    .required('Coupon code is required')
    .matches(/^[A-Z0-9]+$/, 'Coupon code can only contain uppercase letters and numbers'),
});

// Newsletter subscription validation
export const newsletterValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
});

// Search validation
export const searchValidationSchema = Yup.object().shape({
  query: Yup.string()
    .required('Search query is required')
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters'),
});

// File upload validation
type FileWithSizeAndType = File & {
  size: number;
  type: string;
};

export const fileUploadValidationSchema = Yup.object().shape({
  file: Yup.mixed<FileWithSizeAndType>()
    .required('A file is required')
    .test(
      'fileSize',
      'File is too large',
      (value) => !value || (value && value.size <= 5 * 1024 * 1024) // 5MB
    )
    .test(
      'fileFormat',
      'Unsupported file format',
      (value) => !value || (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type))
    ) as Yup.MixedSchema<FileWithSizeAndType>,
});
