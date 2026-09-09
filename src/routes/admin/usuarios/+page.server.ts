import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return {
            usuarios: []
        };
    }

    if (locals.rol !== 'admin') {
        return {
            usuarios: []
        };
    }

    const { data: usuarios, error } = await locals.supabase
        .from('profiles')
        .select('id, nombre, email, rol, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al obtener usuarios:', error);

        return {
            usuarios: []
        };
    }

    return {
        usuarios
    };
};

export const actions: Actions = {
    editar: async ({ request, locals }) => {
        if (!locals.user) {
            return {
                success: false,
                error: 'No estás autenticado.'
            };
        }

        if (locals.rol !== 'admin') {
            return {
                success: false,
                error: 'No tienes permisos para realizar esta acción.'
            };
        }

        const formData = await request.formData();

        const id = formData.get('id');
        const nombre = formData.get('nombre');
        const rol = formData.get('rol');

        if (!id || !nombre || !rol) {
            return {
                success: false,
                error: 'Todos los campos son obligatorios.'
            };
        }

        const { error } = await locals.supabase
            .from('profiles')
            .update({
                nombre: String(nombre),
                rol: String(rol)
            })
            .eq('id', String(id));

        if (error) {
            console.error('Error supabase al editar:', error);

            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true
        };
    }
};