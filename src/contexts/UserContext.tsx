import { createContext } from 'react';
import type { User } from '../types/User';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const defaultUserContext: UserContextType = {
  user: null,
  setUser: () => {},
  logout: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);
