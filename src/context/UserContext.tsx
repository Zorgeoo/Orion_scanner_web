import { createContext, ReactNode, useState } from "react";

export interface databaseModel {
  companyRegNo: string;
  server: string;
  dbName: string;
  companyName: string;
}

export interface UserInfo {
  phoneNo: string;
  token: string;
  userId: string;
  dbase?: databaseModel;
}

interface UserContextValue {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo | null) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
