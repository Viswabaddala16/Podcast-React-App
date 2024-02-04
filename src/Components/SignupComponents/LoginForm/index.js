import React, { useState } from 'react';
import './style.css';
import Button from '../../Common/Button';
import InputIncomponent from '../../Common/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../../../Slices/userSlice';


function LoginForm() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function handleLogin() {
      console.log("Login Button is clicked");
      setLoading(true);
      if (email && password) {
        try {
          // Creating user's account.
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
    
          const user = userCredential.user;
          console.log("user", user);
    
          // Saving user's details.
          const userDoc = await getDoc(doc(db, "users", user.uid));
    
          if (userDoc.exists()) { // Check if the document exists
            const userData = userDoc.data();
            console.log("userData", userData);
    
            // Save data in the redux, call the redux action
            dispatch(
              setUser({
                name: userData.name,
                email: user.email,
                uid: user.uid,
              })
            );
            toast.success("User has been created!");
            setLoading(false);
            navigate("/profile");
          } else {
            toast.error("User data not found.");
            setLoading(false);
          }
        } catch (e) {
          console.log("error", e);
          toast.error(e.message);
          setLoading(false);
        }
      } else {
        toast.error("Make sure the password and email should not be empty");
      }
    }
    
  return (
    <div>
        <InputIncomponent 
        state={email}
        setState = {setEmail}
        placeholder="Email"
        type="email"
        required={true}
        />
        <InputIncomponent 
        state={password}
        setState = {setPassword}
        placeholder="Password"
        type="password"
        required={true}
        />
        <Button text={loading ? "Loading...": "Login"} onClick={handleLogin} disabled={loading
        }/>
        
    </div>
  )
}

export default LoginForm;