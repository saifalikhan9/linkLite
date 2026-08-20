export type SignupPayload = {
    name: string;
    email: string;
    password: string;
  };
  
  export type LoginPayload = {
    email: string;
    password: string;
  };
  
  export type AuthResponse = {
    success: boolean;
    data: {
      id: string;
      email: string;
      accessToken: string;
    };
  };