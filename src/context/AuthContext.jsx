import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile } from "@api/profile";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      setMe(null);
      return;
    }

    const fetchMe = async () => {
      try {
        const data = await getMyProfile();
        setMe(data);
      } catch (err) {
        console.error("Failed to fetch me", err);
        logout(); 
      }
    };

    fetchMe();
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
  };

  const deletePostById = (postId) => {
  setMe((prev) => {
    if (!prev || !prev.posts) return prev;

    return {
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    };
  });
};

  return (
    <AuthContext.Provider
      value={{
        token,
        me,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
        deletePostById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
