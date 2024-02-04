import React, { useState } from 'react'
import Header from '../Components/Common/Header';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import InputIncomponent from '../Components/Common/Input';
import Button from '../Components/Common/Button';
import FileInput from '../Components/Common/Input/FileInput';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function CreateEpisodePage() {
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [audioFile,setAudioFile] = useState("");
    const[loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const  handleAudioFile = (file)=>{
        setAudioFile(file);
    }
    const handleSubmit = async () =>{
        setLoading(true);
        if(title,desc,audioFile,id){
            try {
                const audioRef = ref(
                  storage,
                  `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(audioRef, audioFile);
        
                const audioURL = await getDownloadURL(audioRef);
                const episodeData = {
                  title: title,
                  description: desc,
                  audioFile: audioURL,
                };
                
                await addDoc(collection(db, "podcasts", id, "episodes"), episodeData);
                setLoading(false);
                toast.success("Episode is Created Successfully");
                navigate(`/podcast/${id}`);
                setTitle("");
                setDesc("")
            }catch(e){
                toast.error(e.message)
            }
            
        }
        else{
            toast.error("All Things Must Be There");
            setLoading(false);
        }
    }
  return (
    <div>
        <Header/>
        <div className='input-wrapper'>
            <h1>Create A Episode</h1>
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
            <FileInput id="audio-file-input" 
            accept={"audio/*"} 
            fileHandleFunc={handleAudioFile} 
            text="Upload Audio File"/>
            <Button text={ loading ? "loading" : "Create Episode"} 
            onClick={handleSubmit} disabled={loading} />
        </div>
    </div>
  )
}

export default CreateEpisodePage;
