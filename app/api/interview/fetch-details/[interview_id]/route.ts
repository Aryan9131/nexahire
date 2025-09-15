import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { interview_id: string } }
) {
  try {
    const { interview_id } = params;

    console.log("Fetching interviews for user:", interview_id);

    // ✅ Query Supabase for interview + feedbacks
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
  } catch (error: any) {
    console.error("Error fetching Scheduled interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch Scheduled interviews" },
      { status: 500 }
    );
  }
}
