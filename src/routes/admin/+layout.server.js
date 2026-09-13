import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, depends }) => {
	// 1. Declarar dependencia explícita para que SvelteKit re-ejecute esto ante cualquier cambio de ruta
	depends('supabase:auth');

	// 2. Obtener sesión de locals (definida en hooks.server.js)
	const { session, user } = await locals.safeGetSession();

	// 3. Bloqueo estricto: Si no hay sesión o no hay usuario -> Redirigir inmediatamente
	if (!session || !user) {
		throw redirect(303, '/login');
	}

	// 4. Bloqueo por rol (opcional pero recomendado)
	if (locals.rol && locals.rol !== 'admin') {
		throw redirect(303, '/');
	}

	return {
		session,
		user,
		rol: locals.rol
	};
};