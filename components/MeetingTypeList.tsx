'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
  type MeetingState = 'isInstanceMeeting' | 'isScheduleMeeting' | 'isJoiningMeeting' | 'isRecordingMeeting' | undefined;

  interface HomeCardContent {
    title: string;
    description: string;
    img: string;
    color: string;
    meetingState: MeetingState;
  }
  const homeCardContents : HomeCardContent[] = [
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
        meetingState: 'isRecordingMeeting' as MeetingState
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
    
    if(meeting === 'isRecordingMeeting') router.push('recordings')
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
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
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
      {!callDetails ? (
        <MeetingModal 
          isOpen={meetingState ===  'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Create Meeting'
          className='text-center'
          buttonText='Schedule Meeting'
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
            <Textarea 
              className='border-none bg-dark-3 
              focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) => {
                setValues({...values, description: e.target.value})
              }}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
              <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date) => setValues({...values, dateTime: date!})}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat='MMMM d, YYYY h:mm aa'
                className='w-full rounded bg-dark-3 p-2 focus:outline-none'
              />
          </div>
        </MeetingModal>
        ) : (
        <MeetingModal 
          isOpen={meetingState ===  'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Meeting Created'
          className='text-center'
          buttonText='Coppy Meeting Link'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({title: 'Link copied'})
          }}
          img="/icons/checked.svg"
          buttonIcon='/icons/copy.svg'
        />
        )
      }
      <MeetingModal 
        isOpen={meetingState ===  'isInstanceMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an instance meeting'
        className='text-center'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />
      <MeetingModal 
        isOpen={meetingState ===  'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Type the link here'
        className='text-center'
        buttonText='Join Meeting'
        handleClick={() => router.push(values.link)}
      >
        <Input 
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
          onChange={(e) => setValues({...values, link: e.target.value})}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList