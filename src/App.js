import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
// import Header from "./Components/Common/Header/index.js";
// import SignupForm from "./Components/SignupComponents/SignupForm.js/index.js";
import SignupPage from "./pages/SignupPage.js";
import Profile from "./pages/Profile.js";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import { setUser } from "./Slices/userSlice.js";
import { useDispatch } from "react-redux";
import PrivateRoutes from "./Components/Common/PrivateRoutes.js";
import CreatePodcastPage from "./pages/CreatePodcastPage.js";
import PodcastDetails from "./pages/PodcastDetails.js";
import PodcastPage from "./pages/PodcastPage.js";
import CreateEpisodePage from "./pages/CreateEpisode.js";
import ResetPassword from "./Components/SignupComponents/ResetPassword/index.js";



function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.error("Error fetching user data:", error);
          }
        );

        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <Router>
      
        <Routes>         
          <Route path = "/" element = {<SignupPage/>}/>
          <Route path = "/reset-password" element = {<ResetPassword/>} />
          <Route element = {<PrivateRoutes/>}>
            <Route path = "/profile" element = {<Profile/>}/>
            <Route path = "/create-a-podcast" element = {<CreatePodcastPage/>}/>
            <Route path = "/podcasts" element = {<PodcastPage/>} />
            <Route path = "/podcast/:id" element = {<PodcastDetails/>}/>
            <Route path = "/podcasts/:id/create-episode" element = {<CreateEpisodePage/>}/>
          </Route>
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
