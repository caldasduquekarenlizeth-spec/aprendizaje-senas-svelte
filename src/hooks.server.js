// src/hooks.server.js
import { createSupabaseClient } from '$lib/supabase'

export const handle = async ({ event, resolve }) => {
  // 1. Instanciamos Supabase pasando el evento (para acceder a event.cookies)
    event.locals.supabase = createSupabaseClient(event)


    event.locals.safeGetSession = async () => {
    const {
        data: { session }
    } = await event.locals.supabase.auth.getSession()

    if (!session) {
        return { session: null, user: null }
    }

    // Validamos el usuario directamente con la API de Supabase
    const {
        data: { user },
        error
    } = await event.locals.supabase.auth.getUser()

    if (error) {
      // Si el token expiró o es inválido, retornamos nulo
        return { session: null, user: null }
    }

    return { session, user }
    }

  // 2. Extraemos la sesión y el usuario actual
    const { session, user } = await event.locals.safeGetSession()
    event.locals.session = session
    event.locals.user = user

  // 3. Resolvemos la petición filtrando cookies seguras
    return resolve(event, {
    filterSerializedResponseHeaders(name) {
        return name === 'content-range' || name === 'x-supabase-parse-auth-tokens'
    }
    })
}