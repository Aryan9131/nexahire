// api/auth/callback/route.ts
import { createServerSupabaseClient } from '@/integrations/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('=== AUTH CALLBACK DEBUG ===')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerSupabaseClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Code exchange result:', { data: !!data, error })
      
      if (error) {
        console.error('Error exchanging code:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      console.log('Session created successfully')
      
    } catch (error) {
      console.error('Exception during code exchange:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(`${origin}/dashboard`)
}