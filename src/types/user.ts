export interface IUserAddress {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses: IUserAddress[];
  defaultAddress?: string;
  phone?: string;
  dateOfBirth?: Date;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterData extends ILoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  expiresIn: number;
}

export interface IUpdateProfileData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IResetPasswordData {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
