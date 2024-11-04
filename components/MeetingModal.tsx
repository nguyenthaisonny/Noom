import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
  
interface meetingModalProps {
    isOpen: boolean
    title: string
    className?: string
    buttonText?: string
    buttonIcon?: string
    img?:string
    children?:ReactNode
    onClose: () => void
    handleClick: ()=> void
}
const MeetingModal = (
    {
        isOpen,
        title,
        className,
        buttonText,
        buttonIcon,
        img,
        children,
        onClose,
        handleClick,
    }:
    meetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
            className='flex w-full max-w-[520px] flex-col 
            gap-6 border-none bg-dark-1 px-6 py-9 text-white'            
        >
            <div className='flex flex-col gap-6'>
                {img && (
                    <div className='flex justify-center'>
                        <Image 
                            src={img}
                            alt='img'
                            width={72}
                            height={72}
                        />
                    </div>
                )
                }
                <h1
                    className={cn('text-3xl font-bold leading-[42px]', className)}
                >{title}</h1>
                {children}
                <Button 
                    className='bg-blue-1 focus-visible:ring-0 
                    focus-visible:ring-offset-0'
                    onClick={handleClick}
                >
                    {buttonIcon && (

                        <Image 
                            src={buttonIcon}
                            alt='button icon'
                            height={13}
                            width={13}
                        />
                    )}
                    {buttonText || 'schedule Meeting'}
                </Button>
            </div>
        </DialogContent>
    </Dialog>

  )
}

export default MeetingModal