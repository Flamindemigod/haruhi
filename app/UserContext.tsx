"use client";

import { createContext, useEffect, useState } from "react";

type iUser = {
  userID?: number;
  userAuth?: boolean;
  userName?: string;
  userAvatar?: string;
  userPreferenceShowEndDialog?: boolean;
  userPreferenceSkipOpening?: number;
  userPreferenceDubbed?: boolean;
  userPreferenceEpisodeUpdateTreshold?: number;
  userScoreFormat?: string;
};

const userDefaults = {
  userAuth: false,
  userName: "",
  userID: 0,
  userAvatar: "",
  userPreferenceShowEndDialog: false,
  userPreferenceSkipOpening: 85,
  userPreferenceDubbed: false,
  userPreferenceEpisodeUpdateTreshold: 0.9,
  userScoreFormat: "POINT_10_DECIMAL",
} as iUser;

const userContext = createContext(userDefaults);
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<iUser>(userDefaults);

  const setUserData = async () => {
    function handleResponse(response: any) {
      return response.json().then(function (json: any) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleError(error: any) {
      console.error(error);
      return null;
    }
    const userData = await fetch("http://136.243.175.33:8080/api/getUser")
      .then(handleResponse)
      .catch(handleError);
    if (userData) {
      setUser({
        userAuth: true,
        userName: userData.data.Viewer.name,
        userID: userData.data.Viewer.id,
        userAvatar: userData.data.Viewer.avatar.medium,
        userPreferenceShowEndDialog: JSON.parse(
          localStorage.getItem("UserPrefShowEndDialog") || "{}"
        )
          ? JSON.parse(localStorage.getItem("UserPrefShowEndDialog") || "{}")
          : true,
        userPreferenceSkipOpening: localStorage.getItem("UserPrefSkipOpening")
          ? parseInt(localStorage.getItem("UserPrefSkipOpening") || "{}")
          : 85,
        userPreferenceDubbed: JSON.parse(
          localStorage.getItem("UserPrefDubbed") || "{}"
        )
          ? JSON.parse(localStorage.getItem("UserPrefDubbed") || "{}")
          : false,
        userPreferenceEpisodeUpdateTreshold: localStorage.getItem(
          "UserPrefEpisodeTreshold"
        )
          ? parseFloat(localStorage.getItem("UserPrefEpisodeTreshold") || "{}")
          : 0.9,
        userScoreFormat: userData.data.Viewer.mediaListOptions.scoreFormat,
      });
    }
  };
  useEffect(() => {
    setUserData();
  }, []);
  return (
    <>
      <userContext.Provider value={user}>{children}</userContext.Provider>
    </>
  );
};

export { userContext, UserContextProvider };
