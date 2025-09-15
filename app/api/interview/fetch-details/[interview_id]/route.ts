import { supabase } from "@/integrations/supabase/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { interview_id: string } }
) {
  try {
    const { interview_id } = context.params;
    console.log("Fetching interviews for user:", interview_id);

    const { data: interviews, error } = await supabase
      .from("Interviews")
      .select(`*, Feedbacks!inner (*)`)
      .eq("id", interview_id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    console.log("Scheduled interviews in api:", interviews);
    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Error fetching Scheduled interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch Scheduled interviews" },
      { status: 500 }
    );
  }
}
