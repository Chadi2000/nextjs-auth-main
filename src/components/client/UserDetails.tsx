'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../components/utils/Input'
import LabledInput from '../utils/LabeledInput';
import Image from 'next/image';
import BlankProfile from "../../../public/blankProfile.png"
import CardBox from '../utils/CardBox';;
import { HiArrowNarrowLeft } from 'react-icons/hi'

interface User {
    name: string | null
    email: string
    phoneNumber: string | null
    role: string
    updatedAt: Date
    image: string | null
}


export default function ClientUserDetailsComponent({ user }: { user: User }) {
    useEffect(() => {

    }, [user]);

    const router = useRouter();

    return (
        <div className='flex flex-col gap-4 '>
            <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1 w-max bg-white text-sm font-medium rounded hover:bg-gray-100 border rounded-full"
            >
            <HiArrowNarrowLeft className="text-lg" />
        </button>
            <div className='flex flex-col'>
                <span className="text-[20px] font-semibold">User Information</span>
                <span className='text-[12px] font-light mt-2 mb-4'>
                    User personal details and information
                </span>
            </div>
            <CardBox name='Photos'>
                <div className='flex gap-6'>
                    {user.image !== null ? (
                        <Image objectFit='cover' width={80} height={80} src={user?.image} alt='user image' className='rounded-full w-[80px] h-[80px]' />
                    ) : (
                        <Image objectFit='cover' src={BlankProfile} alt='user image' className='rounded-full w-[100px] h-[100px]' />
                    )}
                    <div className='flex flex-col gap-2'>
                        <span className='capitalize font-semibold text-[18px]'>{user.name}</span>
                        <span className='text-[12px] text-gray-400'>{user.role}</span>
                    </div>
                </div>
            </CardBox>

            <CardBox name='Informations'>
                <div className='flex justify-start flex-wrap items-center gap-12'>
                    <LabledInput readonly label='User Name' InputType='text' width={'300px'} value={user.name || ''} />
                    <LabledInput readonly label='Email' InputType='text' width={'300px'} value={user.email} />
                    <LabledInput readonly label='Phone Number' InputType='text' width={'300px'} value={user.phoneNumber || ''} />
                    <LabledInput readonly label='Role' InputType='text' width={'300px'} value={user.role} />
                    <LabledInput readonly label='Created At' InputType='text' width={'300px'} value={new Date(user.updatedAt).toLocaleString()} />
                </div>
            </CardBox>
        </div>
    );
}