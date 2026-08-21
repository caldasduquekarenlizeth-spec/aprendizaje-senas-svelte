// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
    namespace App {
        // interface Error {}

        interface Locals {
            supabase: import('@supabase/supabase-js').SupabaseClient;
            user: import('@supabase/supabase-js').User | null;
            rol: 'admin' | 'aprendiz' | null;
        }

        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};