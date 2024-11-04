'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

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
  const router = useRouter();
  const  [meetingState, setMeetingState] = 
  useState<MeetingState>();

  const handleClickCard = (meeting: MeetingState) => {
    setMeetingState(meeting)
  }
  const { user } = useUser()
  const client = useStreamVideoClient()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const { toast } = useToast()
  const createMeeting = async () => {
    if(!client || !user) return
    try {
      if(!values.dateTime) {
        toast({
          title: "Please select a day and time",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'Instant meeting'
      if(!call) throw new Error('Fail to create call');
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {description}
        }
      })
      setCallDetails(call)
      
      if(!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: "Meeting created!",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
    }
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