import "./App.css"
import { useSelector } from "react-redux"
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Routhing from "./Routing"
import getToken from "./misc/getToken";
import makeQuery from "./misc/makeQuery"
import { useDispatch } from 'react-redux';
import { setUser } from "./features/user";
import { useEffect } from "react";
import ScrollToTop from './components/ScrollToTop';


function App() {
  const token = getToken();

  let user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {

    const getUserDetails = async () => {
      var query = `query {
                    Viewer {
                        id
                        name
                        avatar{
                            medium
                        }}
                    }`;

      const userData = await makeQuery(query).then((data) =>
        (data.data.Viewer));
      dispatch(setUser({
        userAuth: true,
        userName: userData.name,
        userID: userData.id,
        userAvatar: userData.avatar.medium,
        userToken: getToken(),
        userPreferenceShowEndDialog: JSON.parse(localStorage.getItem("UserPrefShowEndDialog")) ? JSON.parse(localStorage.getItem("UserPrefShowEndDialog")) : true,
        userPreferenceSkipOpening: localStorage.getItem("UserPrefSkipOpening") ? parseInt(localStorage.getItem("UserPrefSkipOpening")) : 85,
        userPreferenceDubbed: JSON.parse(localStorage.getItem("UserPrefDubbed")) ? JSON.parse(localStorage.getItem("UserPrefDubbed")) : false,
        userPreferenceEpisodeUpdateTreshold: localStorage.getItem("UserPrefEpisodeTreshold") ? parseFloat(localStorage.getItem("UserPrefEpisodeTreshold")) : 0.9,
      }));

    };
    const updateUserScoring = async () => {
      var query = `mutation {
      UpdateUser(scoreFormat: POINT_10_DECIMAL) {
        id
      }
    }`;

      makeQuery(query)
    };
    if (!user.userAuth) {
      if (token) {
        getUserDetails();
      }
    }
    updateUserScoring();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Loader />
      {(token) ? (<Routhing />) : (<Login />)}
      <Routes>
        <Route path="/callback" element={<Callback />} />
      </Routes>

    </Router>
  );
}

export default App;