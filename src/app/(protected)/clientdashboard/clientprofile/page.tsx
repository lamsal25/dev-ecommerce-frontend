"use client";
import React, { startTransition, useEffect, useState, useTransition } from 'react';
import { 
  LuUser, LuMail, LuPhone, LuCalendar, 
  LuMapPin, LuFlag, LuFileText, LuShield 
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getUser } from '../../actions/user';
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileDialog } from './components/UserProfileDialog';

export default function UserProfilePage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()
    const [user, setUser] = useState<any>();

    useEffect(() => {
        startTransition(async () => {
            const response = await getUser()
            console.log(response)
            const data = response.data;
            setUser(data)
        });
    }, [])

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isPending) return <ProfileSkeleton />;

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        My Profile
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your personal information and settings
                    </p>
                </div>
                <UserProfileDialog id={user?.id}/>
            </div>

            {/* Profile Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="md:col-span-1 bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <LuUser className="text-5xl text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                        </h2>
                        <p className="text-gray-500 mt-1">{user?.email}</p>
                        
                        <div className="w-full mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <LuCalendar className="text-primary" />
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium">
                                        {formatDate(user?.date_joined)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <LuPhone className="text-primary" />
                                <div>
                                    <p className="text-sm text-gray-600">Mobile</p>
                                    <p className="font-medium">
                                        {user?.profile?.mobile || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="md:col-span-2 bg-white shadow-sm rounded-lg p-6 border border-gray-200 space-y-4">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2">
                        Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <LuUser className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">User ID</p>
                                <p className="font-medium">
                                    #{user?.id || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuUser className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">First Name</p>
                                <p className="font-medium">
                                    {user?.profile?.firstName || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuUser className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Last Name</p>
                                <p className="font-medium">
                                    {user?.profile?.lastName || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuMail className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{user?.email || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuShield className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Email Verification</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <p className="font-medium">
                                        {user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuUser className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Username</p>
                                <p className="font-medium">
                                    {user?.username || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuPhone className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium">{user?.profile?.mobile || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LuCalendar className="text-primary mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Date of Birth</p>
                                <p className="font-medium">
                                    {formatDate(user?.profile?.dateOfBirth)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                    <LuMapPin className="text-primary" /> Address Information
                </h3>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <LuMapPin className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium">
                                {user?.profile?.address || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <LuMapPin className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">City</p>
                            <p className="font-medium">
                                {user?.profile?.city || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <LuFlag className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">State/Province</p>
                            <p className="font-medium">
                                {user?.profile?.state || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <LuFlag className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Country</p>
                            <p className="font-medium">
                                {user?.profile?.country || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <LuFileText className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Postal Code</p>
                            <p className="font-medium">
                                {user?.profile?.postalCode || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status Section */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 flex items-center gap-2">
                    <LuShield className="text-primary" /> Account Status
                </h3>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <LuShield className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Email Verification</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <p className="font-medium">
                                    {user?.isEmailVerified ? 'Verified' : 'Pending Verification'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <LuUser className="text-primary mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Username</p>
                            <p className="font-medium">
                                {user?.username || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-64 rounded-lg" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-64 rounded-lg" />
                </div>
            </div>
            
            <div className="space-y-4">
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    );
}