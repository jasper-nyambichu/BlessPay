'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'member' | 'admin' | 'pastor';
  church: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: SignupData) => Promise<any>;
  logout: () => void;
  confirmSignup: (email: string, code: string) => Promise<any>;
  resendConfirmationCode: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
  church: string;
  role: 'member' | 'admin' | 'pastor';
}

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID!,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((err: any, session: any) => {
          if (err) {
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            const userData: User = {
              id: session.getIdToken().payload.sub,
              email: session.getIdToken().payload.email,
              name: attributes?.find(attr => attr.getName() === 'name')?.getValue() || '',
              phone: attributes?.find(attr => attr.getName() === 'phone_number')?.getValue() || '',
              role: (attributes?.find(attr => attr.getName() === 'custom:role')?.getValue() as any) || 'member',
              church: attributes?.find(attr => attr.getName() === 'custom:church')?.getValue() || '',
            };
            
            setUser(userData);
            setIsLoading(false);
          });
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          checkAuthState();
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: (userAttributes) => {
          resolve({ newPasswordRequired: true, userAttributes });
        },
      });
    });
  };

  const signup = async (userData: SignupData): Promise<any> => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: userData.email }),
        new CognitoUserAttribute({ Name: 'name', Value: userData.name }),
        new CognitoUserAttribute({ Name: 'phone_number', Value: userData.phone }),
        new CognitoUserAttribute({ Name: 'custom:role', Value: userData.role }),
        new CognitoUserAttribute({ Name: 'custom:church', Value: userData.church }),
      ];

      userPool.signUp(
        userData.email,
        userData.password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  };

  const confirmSignup = async (email: string, code: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
  };

  // Implement other methods: resendConfirmationCode, forgotPassword, resetPassword

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      signup,
      logout,
      confirmSignup,
      resendConfirmationCode: async () => {},
      forgotPassword: async () => {},
      resetPassword: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};