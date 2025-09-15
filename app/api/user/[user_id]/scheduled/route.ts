import { supabase } from "@/integrations/supabase/client";
import { NextResponse } from "next/server";

// Correct type definition for Next.js 15
type Params = {
  user_id: string;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
    try {
         // Await the params promise in Next.js 15
        const { user_id } = await params;
        console.log("Fetching interviews for user:", user_id);
        // Fetch interviews for the user from the supabase database
        const { data: interviews, error } = await supabase
                                            .from('Interviews')
                                            .select(` *, Feedbacks!inner (*)`)
                                            .eq('userId', user_id)
                                            .order('created_at', { ascending: false });
        if (error) {
            throw error;
        }
        console.log("Scheduled interviews in api :", interviews);
        return NextResponse.json(interviews);
    } catch (error) {
        console.error("Error fetching Scheduled interviews:", error);
        return NextResponse.json({ error: "Failed to fetch Scheduled interviews" }, { status: 500 });
    }
}
