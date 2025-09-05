import { supabase } from '@/integrations/supabase/client'
import { User } from '@/integrations/supabase/client'

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`
    }
  })
  
  if (error) {
    console.error('Error signing in:', error)
    return { error }
  }
  console.log("data inside signInWithGoogle : ", data)
  return { data }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
  }
}

// Get current user from Supabase Auth
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  console.log("data inside getCurrentUser : ", user)
  return ({
    id: user?.id,
    email: user?.email,
    credits: 0,
    created_at: user?.created_at
  })
}
