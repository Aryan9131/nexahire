import { supabase } from '@/integrations/supabase/client'
import { User } from '@/integrations/supabase/client'

// Check if user exists in our database
export const getUserFromDatabase = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null
    }
    console.error('Error fetching user:', error)
    return null
  }
    console.log("data inside getUserFromDatabase : ", data)

  return ({
      id: data.id,
      email: data.email,
      credits: data.credits,
      created_at: data.created_at
    })
}

// Create user in our database
export const createUserInDatabase = async (authUser: any): Promise<User | null> => {
  const userData = {
    id: authUser.id, // Use Supabase Auth user ID
    email: authUser.email,
  }

  const { data, error } = await supabase
    .from('Users')
    .insert(userData)
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }
  console.log("data inside createUserInDB : ", data)
  return ({
      id: data.id,
      email: data.email,
      credits: data.credits,
      created_at: data.created_at
    })
}

// Main function to sync auth user with database
export const syncUserWithDatabase = async (authUser: any): Promise<User | null> => {
  if (!authUser) return null

  // Check if user exists in our database
  let dbUser = await getUserFromDatabase(authUser.id)

  // If user doesn't exist, create them
  if (!dbUser) {
    dbUser = await createUserInDatabase(authUser)
  }
  console.log("authUser inside syncUserWithDatabase : ", authUser)
  console.log("dbUser inside syncUserWithDatabase : ", dbUser)
  return (
    dbUser
    ?
    {
      id: dbUser.id,
      email: dbUser.email,
      credits: dbUser.credits,
      created_at: dbUser.created_at
    }
    :
    null
  )
}

// Update user in database
export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('Users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return { error }
  }

  return { data }
}
