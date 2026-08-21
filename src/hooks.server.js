import { createSupabaseClient } from '$lib/supabase'
import { redirect } from '@sveltejs/kit'

export const handle = async ({ event, resolve }) => {
  // 1. Instanciamos Supabase pasando el evento
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
      return { session: null, user: null }
    }

    return { session, user }
  }

  // 2. Extraemos la sesión y el usuario actual
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  const pathname = event.url.pathname

  // 3. Protección de la ruta /admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      throw redirect(303, '/login')
    }

    // Consultamos el rol del usuario en la base de datos
    const { data: profile, error: profileError } = await event.locals.supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    // Si hay error o el rol NO es admin, redirigimos a /aprendiz
    if (profileError || !profile || profile.rol !== 'admin') {
      throw redirect(303, '/aprendiz')
    }
  }

  // 4. Protección de la ruta /aprendiz
  if (pathname.startsWith('/aprendiz')) {
    if (!user) {
      throw redirect(303, '/login')
    }

    const { data: profile, error: profileError } = await event.locals.supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    // Si el usuario registrado es de rol 'admin', lo redirigimos a su panel /admin
    if (profile && profile.rol === 'admin') {
      throw redirect(303, '/admin')
    }
  }

  // 5. Redirección si ya está autenticado e intenta ir a /login
  if (pathname === '/login' && user) {
    const { data: profile } = await event.locals.supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (profile?.rol === 'admin') {
      throw redirect(303, '/admin')
    } else {
      throw redirect(303, '/aprendiz')
    }
  }

  // 6. Resolvemos la petición
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-parse-auth-tokens'
    }
  })
}