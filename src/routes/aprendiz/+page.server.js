import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {

    // No hay sesión
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // El usuario no es aprendiz
    if (locals.rol !== 'aprendiz') {
        throw redirect(303, '/admin');
    }

    // El usuario sí es aprendiz
    throw redirect(303, '/modulos');
}