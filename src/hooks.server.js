import { createServerClient } from '@supabase/ssr';

import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
} from '$lib/supabaseClient';

export async function handle({ event, resolve }) {

    event.locals.supabase = createServerClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return event.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, {
                            ...options,
                            path: '/'
                        });
                    });
                }
            }
        }
    );

    // Obtener usuario autenticado
    const {
        data: { user }
    } = await event.locals.supabase.auth.getUser();

    event.locals.user = user;

    // Obtener el rol del usuario
    event.locals.rol = null;

    if (user) {
        const { data: perfil } = await event.locals.supabase
            .from('perfiles')
            .select('rol')
            .eq('id', user.id)
            .single();

        if (perfil) {
            event.locals.rol = perfil.rol;
        }
    }

    return resolve(event);
}