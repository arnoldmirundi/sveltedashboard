import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const session = await supabase.auth.getSession();

  // Protect all routes under /dashboard
  if (event.url.pathname.startsWith('/dashboard') && !session.data.session) {
    throw redirect(303, '/login');
  }

  return resolve(event);
}