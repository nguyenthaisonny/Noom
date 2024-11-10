import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'

type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid'
const MeetingRoom = () => {
  const searchParam = useSearchParams();
  const isPersonalRoom = !!searchParam.get('personal')
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState();
  if(callingState !== CallingState.JOINED) return <Loader/>

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left"/>
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="right"/>
      default:
        break;
    }
  }
  return (
    <section className='realtive h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className='flex size-full max-w-[1000px] items-center'>
          <CallLayout />
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block':   showParticipants
        })}>
          <CallParticipantsList onClose={() => setShowParticipants(false)}/>
        </div>
      </div>

      <div className='fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-5'>
        <CallControls/>
        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='rounded-2xl cursor-pointer bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white'/>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className='bg-dark-1 border-dark-1 text-white'>
            {['Speaker-left', 'Speaker-right', 'Grid'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem 
                  className='cursor-pointer'
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }}
                >
                  {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='border-dark-1'/>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button 
          onClick={() => setShowParticipants((prev) => !prev)}
          className='rounded-2xl cursor-pointer bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'
        >
            <User size={20} className='text-white'/>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
      </div>

    </section>
  )
}

export default MeetingRoom