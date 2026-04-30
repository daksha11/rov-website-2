import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function usePoints() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    let channel: any;

    async function fetchPoints() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        const uid = session.user.id;
        setUserId(uid);

        // 1. Initial Fetch
        let { data, error } = await supabase
          .from("brand_kit_credits")
          .select("points")
          .eq("user_id", uid)
          .single();

        // 2. Failsafe: If no record exists, create it (trigger might have missed existing users)
        if (error && error.code === "PGRST116") {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", uid)
            .single();

          const { data: newRecord, error: insertError } = await supabase
            .from("brand_kit_credits")
            .insert([{ 
              user_id: uid, 
              points: 1000,
              user_name: profile?.full_name || "User",
              user_email: profile?.email || ""
            }])
            .select("points")
            .single();
          
          if (!insertError && newRecord) {
            setPoints(newRecord.points);
          } else {
            console.error("Failed to create initial credits:", insertError);
            setPoints(1000); // Fallback
          }
        } else if (!error && data) {
          setPoints(data.points);
        } else if (error) {
          console.error("Error fetching points:", error);
        }

        setLoading(false);

        // 3. Subscribe to changes
        channel = supabase
          .channel(`brand_kit_credits_${uid}_${Math.random().toString(36).substring(7)}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "brand_kit_credits",
              filter: `user_id=eq.${uid}`,
            },
            (payload) => {
              console.log("Points updated via Realtime:", payload.new.points);
              setPoints(payload.new.points);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to brand_kit_credits updates');
            }
          });
      } catch (err) {
        console.error("Critical error in usePoints:", err);
        setLoading(false);
      }
    }

    fetchPoints();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const deductPoints = async (amount: number = 50) => {
    if (!userId) return { success: false, message: "User not logged in" };
    const supabase = createClient();

    const { data, error } = await supabase.rpc("deduct_brand_kit_points", {
      p_user_id: userId,
      p_deduction_amount: amount,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (data.success) {
      setPoints(data.new_points);
      return { success: true, newPoints: data.new_points };
    } else {
      return { success: false, message: data.message };
    }
  };

  return { points, loading, deductPoints, userId };
}
