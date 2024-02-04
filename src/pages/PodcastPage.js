import React, { useEffect, useState } from 'react';
import Header from '../Components/Common/Header';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase';
import { setPodcasts } from '../Slices/podcastSlice';
import PodcastCard from '../Components/Podcasts/PodcastCard';
import InputIncomponent from '../Components/Common/Input';

function PodcastPage() {
  const dispatch = useDispatch();
  const[search,setSearch] = useState("");
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  const filteredPodcasts = podcasts.filter((item) => 
  item.title.trim().toLowerCase().includes(search.trim().toLowerCase()))

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'podcasts')),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.error('Error fetching podcasts:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className='input-wrapper'>
      <InputIncomponent
        state={search}
        setState = {setSearch}
        placeholder="Search By Title"
        type="text"
        
        />
      <div style={{ marginTop: '2rem' }}>
        <p>Discover The Podcasts</p>
        {filteredPodcasts.length > 0 ? (
          <div className='podcasts-flex'>
            {filteredPodcasts.map((item) => (
              <PodcastCard key={item.id} id={item.id} displayImage={item.displayImage} title={item.title} />
            ))}
          </div>
        ) : (
          <p>{search ? "No Podcasts Found" : "Currently No Podcasts"}</p>
        )}
      </div>
      </div>
     
    </div>
  );
}

export default PodcastPage;
