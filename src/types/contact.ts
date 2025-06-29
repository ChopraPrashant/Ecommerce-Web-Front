export interface ContactInfo {
  id?: string; // Optional for new entries
  name: string; // Concerned person's name
  email: string; // Email address
  phone: string; // Mobile number
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subject: string; // Subject of the contact
  message: string; // Detailed message
  createdAt?: Date; // Auto-generated on the server
  updatedAt?: Date; // Auto-updated on the server
}

// For form validation
export const initialContactInfo: Omit<ContactInfo, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India' // Default country
  },
  subject: '',
  message: ''
};

// Validation schema (using Yup)
export const contactValidationSchema = {
  name: (value: string) => value.trim().length >= 2 || 'Name is required',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Valid email is required',
  phone: (value: string) => /^[0-9]{10}$/.test(value) || 'Valid 10-digit phone number is required',
  'address.street': (value: string) => value.trim().length > 0 || 'Street address is required',
  'address.city': (value: string) => value.trim().length > 0 || 'City is required',
  'address.state': (value: string) => value.trim().length > 0 || 'State is required',
  'address.postalCode': (value: string) => /^[0-9]{6}$/.test(value) || 'Valid 6-digit postal code is required',
  subject: (value: string) => value.trim().length >= 5 || 'Subject is required',
  message: (value: string) => value.trim().length >= 10 || 'Message should be at least 10 characters'
};
