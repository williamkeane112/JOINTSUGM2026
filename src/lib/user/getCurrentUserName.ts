import { supabase } from "../supabaseClient";

export async function getCurrentUserName(): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return "Pelajar";
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Gagal mengambil nama profil:", profileError.message);
  }

  // Prioritaskan nama yang tersimpan di tabel users.
  const profileName = profile?.full_name?.trim();

  if (profileName) {
    return profileName;
  }

  // Jika tidak ada, gunakan metadata akun.
  const metadata = user.user_metadata ?? {};
  const metadataName =
    metadata.full_name ?? metadata.name ?? metadata.display_name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  // Pilihan terakhir: nama dari email.
  return user.email?.split("@")[0] || "Pelajar";
}