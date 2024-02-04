import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileInput from '../Common/Input/FileInput';
import Button from '../Common/Button';
import InputIncomponent from '../Common/Input';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';


function PodcastForm() {
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [displayImage,setDisplayImage] = useState("");
    const [bannerImage,setBannerImage] = useState("");
    const[loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlePodcast = async () => {
        
        if( title && desc && bannerImage && displayImage){
          setLoading(true);
          // 1.Upload the files -> get the downloadded links
          try{
            const bannerImageRef = ref(
            storage,`podcasts/${auth.currentUser.uid}/${Date.now()}`
          );
          await uploadBytes(bannerImageRef,bannerImage);
          const bannerImageUrl = await getDownloadURL(bannerImageRef);
          const displayImageRef = ref(
            storage,`podcasts/${auth.currentUser.uid}/${Date.now()}`
          );
          await uploadBytes(displayImageRef,displayImage);
          const displayImageUrl = await getDownloadURL(displayImageRef);
          console.log("banner Image",displayImageUrl);
          const podcastData ={
            title : title,
            description: desc,
            displayImage : displayImageUrl,
            bannerImage : bannerImageUrl,
            createdBy: auth.currentUser.uid,
          };
          const docRef = await addDoc(collection(db,"podcasts"),podcastData);
          setTitle("");
          setDesc("");
          setBannerImage(null);
          setDisplayImage(null);
          toast.success("Podcast Created");
          setLoading(false);
          }catch(e){
            toast.error(e.message);
            setLoading(false);
          }
          
          // 2.create new doc in a new collection called  podcasts
          // 3. save this new podcasts episodes in our podcasts

        }else{
          toast.error("Please Enter The All Details");
          setLoading(false);
        }
    }
    function handleBannerImage(file){
      setBannerImage(file)
    }
    function handleDisplayImage(file){
      setDisplayImage(file)
    }
  return (
    <>      
      <h1>Podcast Form</h1>
      <InputIncomponent
        state={title}
        setState = {setTitle}
        placeholder="Title"
        type="text"
        required={true}
        />
        <InputIncomponent
        state={desc}
        setState = {setDesc}
        placeholder="Description"
        type="text"
        required={true}
        />
        <FileInput id="banner-image-input" accept={"image/*"} fileHandleFunc={handleBannerImage} text="Banner Image"/>
        <FileInput id="banner-display-input" accept={"image/*"} fileHandleFunc={handleDisplayImage} text="Display Image"/>
        <Button text={ loading ? "loading" : "Create Podcast"} onClick={handlePodcast} />
    </>
  )
}

export default PodcastForm
