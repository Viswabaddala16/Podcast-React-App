import React from 'react'
import PodcastForm from '../Components/CreateAPodcast/PodcastForm';
import Header from '../Components/Common/Header';

function CreatePodcastPage() {
  return (
    <div className='input-wrapper'  >
        <Header/>
        <PodcastForm/>
    </div>
  )
}

export default CreatePodcastPage
