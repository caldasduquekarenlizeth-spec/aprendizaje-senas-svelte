// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session } from '@supabase/supabase-js';

declare global {
    namespace App {
        // interface Error {}

        interface Locals {
            supabase: import('@supabase/supabase-js').SupabaseClient;
            safeGetSession: () => Promise<{
                session: Session | null;
                user: User | null;
            }>;
            user: import('@supabase/supabase-js').User | null;
            rol: 'admin' | 'aprendiz' | null;
        }

        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};