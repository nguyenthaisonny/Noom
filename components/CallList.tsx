//@ts-nocheck
'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/node-sdk'
import { Call } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import MeetingCard from './MeetingCard'
import Loader from './Loader'

const CallList = ({type}: {type: 'upcoming' | 'recordings' | 'ended'}) => {
    const {
        endedCalls,
        upcomingCalls,
        callRecordings,
        isLoading
    } = useGetCalls()
    console.log('upcoming', upcomingCalls);
    
    const router = useRouter()
    const [recordings, setRecordings] = useState<CallRecording[]>()
    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'upcoming':
                return upcomingCalls;
            case 'recordings':
                return recordings;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    }
    const calls = getCalls()
    const noCallMessage = getNoCallsMessage()
    if(isLoading) return <Loader/>
  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {
            calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={(meeting as Call)?.id}
                        icon={type === 'ended' ? '/icons/previous.svg' :
                            type === 'upcoming' ? '/icons/upcoming.svg' :
                            '/icons/recordings.svg'
                        }
                        title={(meeting as Call).state.custom.description || 'No description'}
                        date={meeting?.state.startsAt.toLocaleString() || meeting?.start_time.toLocaleString()}
                        isPreviousMeeting={type === 'ended'}
                        buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                        buttonText={type === 'recordings' ? 'Play' : 'Start'}

                        link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                        handleClick={type === 'recording' ? () => router.push(meeting.url) : 
                            () => router.push(`/meeting/${meeting.id}`)
                        }
                    />
                ))
            ) : <h1>{noCallMessage}</h1>
        }
    </div>
  )
}

export default CallList