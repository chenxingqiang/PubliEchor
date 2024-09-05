// chrome-extension/lib/background/auth.ts

import { supabase } from '@packages/supabase-client';

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
