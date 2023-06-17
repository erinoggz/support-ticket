export type RegisterDto = {
  email: string;
  password: string;
  userName: string;
  userType: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type updateUserDto = {
  userName: string;
  userType: string;
};
