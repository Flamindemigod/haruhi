import "./App.css"
import { useSelector } from "react-redux"
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Routhing from "./Routing"



function App() {
  let user = useSelector((state) => state.user.value);
  return (
    <Router>
      <Loader />
      {(user.userAuth) ? (<Routhing />) : (<Login />)}
      <Routes>
        <Route path="/callback" element={<Callback />} />
      </Routes>
      
    </Router>
  );
}

export default App;
