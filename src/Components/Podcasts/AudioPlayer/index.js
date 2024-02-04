import React, { useEffect, useRef, useState } from 'react';
import {FaPlay,FaPause,FaVolumeUp,FaVolumeMute} from 'react-icons/fa';
import './style.css';

function AudioPlayer({audioSrc,image}) {
    const audioRef = useRef();
    const[duration,setDuration] = useState(0)
    const[isPlaying,setIsPlaying] = useState(true);
    const[isMute,setIsMute] = useState(false);
    const[volume,setVolume] = useState(1);
    const[currentTime,setCurrentTime] = useState(0)

    const  handleDuration = (e) =>{
        setCurrentTime(e.target.value);
        audioRef.current.currentTime = e.target.value;
    }
    const handlePlay = () => {
        if(isPlaying){
            setIsPlaying(false);
        }else{
            setIsPlaying(true);
        }
    }
    const handleMute = () => {
        if(isMute){
            setIsMute(false);
        }else{
            setIsMute(true);
        }
    }
    const handleVolume = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    }
    useEffect(() => {
        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying]);
    
    
    useEffect(() => {
        if(!isMute){
            audioRef.current.volume = 1;
            setVolume(1);
            
        }else{
            audioRef.current.volume = 0;
            setVolume(0);
        }
    },[isMute]);
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      };
    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
    
        return () => {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
          audio.removeEventListener("ended", handleEnded);
        };
      }, []);
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };
    
      const handleEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false);
      };
  return (
    <div className='custom-audio-player'>
        <img src={image} className='display-image-player'/>
        <audio  ref = {audioRef} src={audioSrc}/>
        <div className='duration-flex'>
            <p className = "audio-btn" onClick={handlePlay}>{isPlaying ? <FaPause/> : <FaPlay/>}</p>
            <p>{formatTime(currentTime)}</p>
            <input 
            type='range' 
            max={duration}
            value={currentTime}
            className='duration-range' 
            onChange={handleDuration}
            step={0.01}/>
            <p >{formatTime(duration-currentTime)}</p>{""}
            <p className = "audio-btn"  onClick={handleMute}>{!isMute ? <FaVolumeUp/> : <FaVolumeMute/>}  </p>
            <input type='range' 
            className='volume-range' 
            onChange={handleVolume}
            value={volume}
            max={1}
            min={0}
            step={0.01}
            />

        </div>
      
    </div>
  )
}

export default AudioPlayer;
