'use client'
import { Calendar, Home, Inbox, Search, Settings, Grid2X2, Grid } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logo from "@/assets/logo-image.png"
import logo1 from "@/assets/image.jpg"
import logo2 from "@/assets/logo2.svg"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Grid2X2,
    },
    {
        title: "Scheduled Interview",
        url: "/scheduled",
        icon: Inbox,
    },
    {
        title: "All Interviews",
        url: "/all-interviews",
        icon: Calendar,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const path = usePathname();
    console.log("Pathname : ", path)
    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <Image src={logo2} alt="logo-image.png" width={350} height={70} />
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-gray-50" >
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col justify-center items-start gap-1">
                            <SidebarMenuItem className="w-full ">
                                <SidebarMenuButton asChild className="p-5 bg-blue-600 hover:bg-blue-500 hover:text-white text-white font-semibold ">
                                    <Link href="#">
                                        <Calendar className="mr-2" />
                                        <span>Create New Interview</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col justify-center items-start gap-1">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="w-full border-r border-gray-200 hover:border-blue-400 font-semibold">
                                    <SidebarMenuButton asChild className={`p-5 ${path.split('/').includes(item.url.split('/')[1]) && 'bg-blue-50'}`}>
                                        <Link href={item.url} >
                                            <item.icon className={`mr-2 ${path.split('/').includes(item.url.split('/')[1]) && 'text-primary'}`} />
                                            <span className={`${path.split('/').includes(item.url.split('/')[1]) && 'text-primary'}`}>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}