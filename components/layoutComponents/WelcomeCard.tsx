'use client'
import { useAuth } from '@/hooks/useAuth';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from 'next/link';
import { Bell } from 'lucide-react';

const WelcomeCard = () => {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in to access the dashboard.</p>;
    return (
        <div className='p-5 my-8 mx-5 bg-white rounded-md shadow-sm flex items-center justify-between'>
            <div className='space-y-1'>
                <h2 className='text-lg font-semibold'>Welcome to the Dashboard</h2>
                <p className='text-sm text-gray-600'>Here you can manage your interviews and settings.</p>
            </div>
            <div className='flex-shrink-0 flex items-center gap-4'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger><Bell className='text-primary h-5 w-5'/></NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Components</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Documentation</Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">Blocks</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default WelcomeCard