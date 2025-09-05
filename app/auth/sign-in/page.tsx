import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import nexahireLogo from '@/assets/logo-image.jpg';
import authBackground from '@/assets/auth-background.jpg';
import LoginButton from '@/components/auth/LoginButton';

const page = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${authBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-1">
            <div className="mx-auto">
              <Image
                src={nexahireLogo}
                alt="NexaHire Logo"
                className="h-16 w-auto mx-auto mb-4 rounded-lg"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome to NexaHire
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Next-Gen AI Recruiter Voice Agent
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                Sign in to access your AI-powered recruiting platform
              </p>

               <LoginButton/>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-white/80">
            Revolutionizing recruitment with AI-powered voice conversations
          </p>
        </div>
      </div>
    </div>
  )
}

export default page