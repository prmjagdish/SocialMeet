import { useEffect, useState, useContext, createContext } from "react";
import { getSuggestedUsers } from "@api/profile";
import { useAuth } from "@context/AuthContext";

const SuggestedUsersContext = createContext(null);

export const SuggestedUsersProvider = ({ children }) => {
  const { me, loading } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if(loading) return;
    if (!me?.user?.id) return;

    const fetchUsers = async () => {
      try {
        const users = await getSuggestedUsers(me.user.id);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Error fetching suggested users", err);
      }
    };

    fetchUsers();
  }, [me?.user?.id]);

  return (
    <SuggestedUsersContext.Provider
      value={{
        suggestedUsers,
        setSuggestedUsers,
        visibleCount,
        setVisibleCount,
      }}
    >
      {children}
    </SuggestedUsersContext.Provider>
  );
};

export const useSuggestedUsers = () => useContext(SuggestedUsersContext);
