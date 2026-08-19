import { createServerClient, isBrowser} from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$lib/supabaseClient'

/**
 * Creación del cliente
@param {import('@sveltejs/kit').RequestEvent | any} event
 */

export const createSupabaseClient = (event) => {
    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
        getAll: () => {
        return event?.cookies
            ? event.cookies.getAll()
            : isBrowser()
            ? parseCookies(document.cookie)
            : []
        },
        setAll: (cookiesToSet) => {
        if (event?.cookies) {
            cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' })
            })
        }
        }
    }
    })
}

/**
 * Función auxiliar para re-interpretar o parsear cookies en el navegador
 * @param {string} cookieString
 */

function parseCookies(cookieString) {
    return cookieString.split(';').map((v) => {
    const parts = v.split('=')
    return { name: parts[0]?.trim(), value: parts[1]?.trim() }
    })
}