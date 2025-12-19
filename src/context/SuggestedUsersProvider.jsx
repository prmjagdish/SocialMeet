import { useEffect, useState, useContext,createContext} from "react";
import { getSuggestedUsers } from "@api/profile";
import { ProfileContext } from "@context/ProfileContext";

const SuggestedUsersContext = createContext(null);

export const SuggestedUsersProvider = ({ children }) => {
  const { profile } = useContext(ProfileContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!profile?.user?.id) return;

    const fetchUsers = async () => {
      try {
        const users = await getSuggestedUsers(profile.user.id);
        setSuggestedUsers(users);
      } catch (err) {
        console.error("Error fetching suggested users", err);
      }
    };

    fetchUsers();
  },[profile?.user?.id]);

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
