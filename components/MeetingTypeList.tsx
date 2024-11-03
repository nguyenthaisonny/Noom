'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'

const MeetingTypeList = () => {
  const homeCardContents = [
    {
        title: 'New Meeting',
        description: 'Start an instant meeting',
        img: '/icons/add-meeting.svg',
        color: 'bg-orange-1',
        meetingState: 'isInstanceMeeting'
    },
    {
        title: 'Schedule Meeting',
        description: 'Plan your meeting',
        img: '/icons/schedule.svg',
        color: 'bg-blue-1',
        meetingState: 'isScheduleMeeting'
    },
    {
        title: 'View Recordings',
        description: 'Checkout your recording',
        img: '/icons/recordings.svg',
        color: 'bg-purple-1',
        meetingState: 'isJoiningMeeting'
    },
    {
        title: 'Join meeting',
        description: 'Via invition link',
        img: '',
        color: 'bg-yellow-1',
        meetingState: 'isJoiningMeeting'
    },
  ]
  const  [meetingState, setMeetingState] = useState();
  
  const handleClickCard = () => {

  }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      {homeCardContents.map((item) => (
        <HomeCard 
          key={item.title}
          title={item.title}
          description={item.description}
          img={item.img}
          handleClick={handleClickCard}
          className={item.color}
        
        />
      ))}
    </section>
  )
}

export default MeetingTypeList