'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'

const MeetingTypeList = () => {
  type MeetingState = 'isInstanceMeeting' | 'isScheduleMeeting' | 'isJoiningMeeting' | undefined;

  interface HomeCardContent {
    title: string;
    description: string;
    img: string;
    color: string;
    meetingState: MeetingState;
  }
  const homeCardContents = [
    {
        title: 'New Meeting',
        description: 'Start an instant meeting',
        img: '/icons/add-meeting.svg',
        color: 'bg-orange-1',
        meetingState: 'isInstanceMeeting' as MeetingState
    },
    {
        title: 'Schedule Meeting',
        description: 'Plan your meeting',
        img: '/icons/schedule.svg',
        color: 'bg-blue-1',
        meetingState: 'isScheduleMeeting' as MeetingState
    },
    {
        title: 'View Recordings',
        description: 'Checkout your recording',
        img: '/icons/recordings.svg',
        color: 'bg-purple-1',
        meetingState: 'isJoiningMeeting' as MeetingState
    },
    {
        title: 'Join meeting',
        description: 'Via invition link',
        img: '/icons/join-meeting.svg',
        color: 'bg-yellow-1',
        meetingState: 'isJoiningMeeting' as MeetingState
    },
  ]
  const  [meetingState, setMeetingState] = 
  useState<MeetingState>();

  const handleClickCard = (meeting: MeetingState) => {
    setMeetingState(meeting)
  }
  const createMeeting = () => {

  }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      {homeCardContents.map((item) => (
        <HomeCard 
          key={item.title}
          title={item.title}
          description={item.description}
          img={item.img}
          handleClick={() => handleClickCard(item.meetingState)}
          className={item.color}
        
        />
      ))}
      <MeetingModal 
        isOpen={meetingState ===  'isInstanceMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an instance meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList