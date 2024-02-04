import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../Components/Common/Button';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth, storage } from '../firebase';
import Header from '../Components/Common/Header';
import Loader from '../Components/Common/Loader';
import { setUser } from '../Slices/userSlice';

function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const db = getFirestore(); // Use getFirestore to create the Firestore instance

          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            // Update user data in Redux store
            dispatch(
              setUser({
                name: userData.name,
                email: currentUser.email,
                uid: currentUser.uid,
                profileImageURL: userData.profileImageURL,
              })
            );
          } else {
            console.error('User document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        // If no user is authenticated, you might want to redirect to the login page
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <p>No user data found.</p>;
  }

  function handleLogOut() {
    signOut(auth)
      .then(() => {
        toast.success('User LogOut');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div>
      <Header />
      <div className='profile-container input-wrapper'>
        {user.profileImageURL && (
          <img src={user.profileImageURL} alt="Profile" className="profile-image" />
        )}
        
      </div>
      <div className='input-wrapper' >
        <h2 style={{marginTop: "10px"}}>{user.name}</h2>
        <h2 style={{marginTop: "10px"}}>{user.email}</h2>
        <h2 style={{marginTop: "10px"}}>{user.uid}</h2>
        <Button text={'SignOut'} 
        onClick={handleLogOut} 
        style={{width: "40%"}}
        />

      </div>
        
      
      
      
    </div>
  );
}

export default Profile;
