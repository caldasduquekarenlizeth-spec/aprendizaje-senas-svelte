import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {

    // No está autenticado
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // Está autenticado pero no es administrador
    if (locals.rol !== 'admin') {
        throw redirect(303, '/aprendiz');
    }

    return {
        user: locals.user,
        rol: locals.rol
    };
}