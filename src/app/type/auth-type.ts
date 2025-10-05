export type User = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata: {
    displayName?: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
};

export type AuthType = {
  user: User | null;
  isLoggedIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (payload: LoginPayload) => Promise<any>;
  signOut: () => Promise<void>;
};
