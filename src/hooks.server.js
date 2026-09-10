import { createServerClient } from '@supabase/ssr';

import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
} from '$lib/supabaseClient'

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
            .from('profiles')
            .select('rol')
            .eq('id', user.id)
            .single();

        if (perfil) {
            event.locals.rol = perfil.rol;
        }
    }

    event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			// El token o la cookie no son válidos/expiraron
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Necesario para pasar cabeceras de Supabase hacia la respuesta
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
}