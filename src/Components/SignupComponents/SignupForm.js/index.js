import React, { useEffect, useState } from 'react';
import './style.css';
import Button from '../../Common/Button';
import InputIncomponent from '../../Common/Input';
import {auth,db, storage} from '../../../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc,setDoc, updateDoc} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import {setUser} from '../../../Slices/userSlice';
import FileInput from '../../Common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (profileImageURL) {
      // Save data in the redux, call the redux action
      dispatch(
        setUser({
          name: fullName,
          email: email,
          uid: auth.currentUser.uid,
          profileImageURL: profileImageURL,
        })
      );
    }
  }, [profileImageURL, fullName, email, dispatch]);

  const handleProfileImage = (file) => {
    setProfileImage(file);
  };

  const handleSignup = async () => {
    console.log("Handling Signup...");
    setLoading(true);

    if (
      password === conformPassword &&
      password.length >= 6 &&
      fullName &&
      email &&
      profileImage
    ) {
      try {
        // Creating user's account.
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        console.log("user", user);

        // Saving user's details.
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          profileImageURL: "", // Placeholder for the profile image URL
        });

        // Upload profile image to Firebase Storage
        const storageRef = ref(storage, `profile-images/${user.uid}`);
        await uploadBytes(storageRef, profileImage);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Update the user's document with the profile image URL
        await updateDoc(doc(db, "users", user.uid), {
          profileImageURL: downloadURL,
        });

        setProfileImageURL(downloadURL); // Set the URL in local state

        toast.success("User has been created!");
        setLoading(false);
        navigate("/profile");
      } catch (e) {
        console.error("error", e);
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // Handle password mismatch or length error
      if (password !== conformPassword) {
        toast.error(
          "Please Make Sure your password and Confirm Password matches!"
        );
      } else if (password.length < 6) {
        toast.error("Please Make Sure your password is more than 6 digits long!");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... your input components ... */}
      <InputIncomponent
        state={fullName}
        setState = {setFullName}
        placeholder="Full Name"
        type="text"
        required={true}
        />
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
        <InputIncomponent 
        state={conformPassword}
        setState = {setConformPassword}
        placeholder="Conform Passord"
        type="password"
        required={true}
        />
      <FileInput
        text={"Upload Profile Image"}
        accept={"image/*"}
        fileHandleFunc={handleProfileImage}
        id="profileImageInput"
      />
      <Button text={"Signup"}
      // style={{marginTop : "2rem"}}
       onClick={handleSignup} />
    </div>
  );
}

export default SignupForm;
