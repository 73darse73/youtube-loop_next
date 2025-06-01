import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 認証機能を実装
    setIsLoading(false);
  }, []);

  const login = async () => {
    // TODO: ログイン処理を実装
  };

  const logout = async () => {
    // TODO: ログアウト処理を実装
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
}; 