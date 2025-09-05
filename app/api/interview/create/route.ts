// api/interview/create/route.ts
import { supabase } from '@/integrations/supabase/client';
import { createServerSupabaseClient } from '@/integrations/supabase/server';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('=== API ROUTE DEBUG ===')
    
    // Create server client with cookie context
    // const supabase = await createServerSupabaseClient();
    
    // Get session first (more reliable than getUser for server-side)
    // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // console.log('Session error:', sessionError)
    // console.log('Session exists:', !!session)
    // console.log('Session user:', session?.user?.id)
    
    // if (sessionError || !session || !session.user) {
    //   console.log("** Current user: null - Unauthorized", sessionError)
    // }


    // Get request data
    const requestData = await request.json()
    const { jobPosition, jobDescription, questions, duration, userId, types } = requestData
    
    console.log('About to insert interview for user:', userId)
    
    // Insert interview
    const { data, error } = await supabase
      .from('Interviews')
      .insert({
        userId: userId,
        jobPosition,
        jobDescription, 
        questions,
        duration,
        types
      })
      .select()

    if (error) {
      console.error('Error creating interview:', error)
      return NextResponse.json({ error: 'Failed to create interview', details: error.message }, { status: 500 })
    }

    console.log('Interview created successfully:', data)
    return NextResponse.json({ interview : data[0] }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}