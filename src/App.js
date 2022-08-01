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


function App() {
  const token = getToken();

  let user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(()=>{
  
  const getUserDetails = async () => {
    var query = `query {
                    Viewer {
                        id
                        name
                        avatar{
                            medium
                        }}
                    }`;

    makeQuery(query).then((data) => {
      const user = data.data.Viewer;

      dispatch(setUser({
        userAuth: true,
        userName: user.name,
        userID : user.id,
        userAvatar: user.avatar.medium,
        userToken: getToken()
      }));
    });
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
      <Loader />
      {(token) ? (<Routhing />) : (<Login />)}
      <Routes>
        <Route path="/callback" element={<Callback />} />
      </Routes>
      
    </Router>
  );
}

export default App;