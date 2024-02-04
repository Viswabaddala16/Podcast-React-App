import React, { useEffect, useState } from 'react'
import Header from '../Components/Common/Header'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../Components/Common/Button';
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import EpisodeDetails from '../Components/Podcasts/EpisodeDetailsPage';
import AudioPlayer from '../Components/Podcasts/AudioPlayer';

function PodcastDetails() {
    const {id} = useParams();
    const[episodes,setEpisodes] = useState([]);
    const[podcast,setPodcast] = useState({});
    const[playingFile,setPlayingFile] = useState("");
    const [episodeToDelete, setEpisodeToDelete] = useState(null);
    console.log("The Id is ",id);
    const navigate = useNavigate();

    const handleDeleteEpisode = async (episodeId) => {
      try {
          // TODO: Implement the episode deletion logic using Firestore
          // Example code:
          const episodeRef = doc(db, "podcasts", id, "episodes", episodeId);
          await deleteDoc(episodeRef);
          toast.success("Episode deleted successfully!");
      } catch (error) {
          toast.error(`Error deleting episode: ${error.message}`);
      }
    };
    
  
    
    useEffect(() => {
        if(id){
            getData();
        }
        
    },[id])
    const getData = async () => {
        try{
            const docRef = doc(db,"podcasts",id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                console.log("Doc Data",docSnap.data());
                setPodcast({id:id,...docSnap.data()})
            }else{
                toast.error("No Document");
                navigate("/podcasts")
            }
        }catch(e){
            toast.error(e.message);
        }
    }
    useEffect(() => {
        const unsubscribe = onSnapshot(
          query(collection(db, "podcasts", id, "episodes")),
          (querySnapshot) => {
            const episodesData = [];
            querySnapshot.forEach((doc) => {
              episodesData.push({ id: doc.id, ...doc.data() });
            });
            setEpisodes(episodesData);
          },
          (error) => {
            console.error("Error fetching episodes:", error);
          }
        );
    
        return () => {
          unsubscribe();
        };
      }, [id]);


    
  return (
    <div>
      <Header/>
      <div className='input-wrapper' style={{marginTop: "0rem"}}>
        {podcast.id && (
            <>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems : "center",
                    width : "100%",
                    margin: "1rem"
                }}>
                    <h1 className='podcast-title-heading '>{podcast.title}</h1>
                    {podcast.createdBy === auth.currentUser.uid &&(
                        <Button text={"Create A Episode"} 
                        style={{margin: "0rem",width: "300px !important"}}
                        onClick={() => {
                            if (podcast.id) {
                                navigate(`/podcasts/${podcast.id}/create-episode`);
                            } else {
                                // Handle the case where podcast.id is not available
                                console.error("Podcast ID is not available");
                            }
                        }}/>
                    )}  
                </div>
                <div className='banner-image'>
                    <img src={podcast.bannerImage}/>
                </div>
                <p className='podcast-description'>{podcast.description }</p>
               <h1 className='podcast-title-heading'>Episodes</h1>
               {episodes.length>0 ? (
               <>
                {episodes.map((episode,index) =>{
                    return <EpisodeDetails 
                    key={index}
                    index={index + 1}
                    title={episode.title} 
                    description={episode.description} 
                    audioFile={episode.audioFile}
                    onClick={(file) => setPlayingFile(file)}
                    onDelete={() => handleDeleteEpisode(episode.id)}
                    
                    />
                })}
               </>
               ):(
               <p>
                No Episodes
               </p>)}
               {episodeToDelete && (
                  <div>
                      <p>Are you sure you want to delete this episode?</p>
                      <Button text="Cancel" onClick={() => setEpisodeToDelete(null)} />
                      <Button text="Delete" onClick={() => handleDeleteEpisode(episodeToDelete)} />
                  </div>
                )}
            </>
        )}
        
      </div>
      
      {playingFile && (<AudioPlayer audioSrc={playingFile} image={podcast.displayImage}/>)}
      
      {console.log('Playing file is', playingFile)}
    </div>
  )
}

export default PodcastDetails;
