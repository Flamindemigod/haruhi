"use client";

import { createContext, useEffect, useState } from "react";
export type iUser = {
  userID?: number;
  userAuth?: boolean;
  userName?: string;
  userAvatar?: string;
  userShowAdult?: boolean;
  userPreferenceMangaEndDialog?: boolean;
  userPreferenceShowEndDialog?: boolean;
  userPreferenceSkipOpening?: number;
  userPreferenceDubbed?: boolean;
  userPreferenceEpisodeUpdateTreshold?: number;
  userPreferenceMangaUpdateTreshold?: number;
  userScoreFormat?: string;
  sessionID: string;
  broadcastChannel?: BroadcastChannel;
};

const userDefaults = {
  userAuth: false,
  userName: "",
  userID: 0,
  userAvatar: "",
  userShowAdult: false,
  userPreferenceMangaEndDialog: false,
  userPreferenceShowEndDialog: false,
  userPreferenceSkipOpening: 85,
  userPreferenceDubbed: false,
  userPreferenceEpisodeUpdateTreshold: 0.85,
  userPreferenceEpisodeMangaTreshold: 0.6,
  userScoreFormat: "POINT_10_DECIMAL",
  sessionID: "",
} as iUser;

const userContext = createContext(userDefaults);
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<iUser>(userDefaults);

  const setUserData = async (
    broadcastChannel: BroadcastChannel,
    newSesh: boolean = false
  ) => {
    function handleResponse(response: any) {
      return response.json().then(function (json: any) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleError(error: any) {
      console.log(error);
    }
   await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/getUser?${newSesh ? "newSesh" : ""
      }`
    )
      .then(handleResponse).then((userData)=>{
        setUser({
          userAuth: true,
          sessionID: userData.sessionKey,
          broadcastChannel: broadcastChannel,
          userName: userData.data.Viewer.name,
          userID: userData.data.Viewer.id,
          userAvatar: userData.data.Viewer.avatar.medium,
          userShowAdult: userData.data.Viewer.options.displayAdultContent,
          userPreferenceMangaEndDialog:
            localStorage.getItem("UserPrefMangaEndDialog") === "true"
              ? true
              : false,
          userPreferenceShowEndDialog:
            localStorage.getItem("UserPrefShowEndDialog") === "true"
              ? true
              : false,
          userPreferenceSkipOpening: !Number.isNaN(
            parseFloat(String(localStorage.getItem("UserPrefSkipOpening")))
          )
            ? parseFloat(String(localStorage.getItem("UserPrefSkipOpening")))
            : undefined,
          userPreferenceDubbed:
            localStorage.getItem("UserPrefDubbed") === "true" ? true : false,
          userPreferenceEpisodeUpdateTreshold: !Number.isNaN(
            parseFloat(String(localStorage.getItem("UserPrefEpisodeTreshold")))
          )
            ? parseFloat(String(localStorage.getItem("UserPrefEpisodeTreshold")))
            : undefined,
          userPreferenceMangaUpdateTreshold: !Number.isNaN(
            parseFloat(String(localStorage.getItem("UserPrefMangaTreshold")))
          )
            ? parseFloat(String(localStorage.getItem("UserPrefMangaTreshold")))
            : undefined,
          userScoreFormat: userData.data.Viewer.mediaListOptions.scoreFormat,
        });
      })
      .catch(handleError);
  };
  useEffect(() => {
    const broadcastChannel = new BroadcastChannel("haruhi-user-updates");
    setUserData(broadcastChannel, true);
    broadcastChannel.postMessage("newPage");
    broadcastChannel.onmessage = (event) => {
      console.log(event);
      if (event.data === "userUpdate") {
        setUserData(broadcastChannel);
        console.log("update recieved");
      }
      if (event.data === "newPage") {
        setUserData(broadcastChannel);
      }
    };
  }, []);
  return (
      <userContext.Provider value={user}>{children}</userContext.Provider>
  );
};

export { userContext, UserContextProvider };
