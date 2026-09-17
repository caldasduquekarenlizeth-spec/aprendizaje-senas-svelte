import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.rol !== 'admin') {
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
        usuarios: usuarios ?? []
    };
};

export const actions: Actions = {
        // =========================
    // AGREGAR USUARIO
    // =========================
    agregar: async ({ request, locals }) => {

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

        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmarPassword = formData.get('confirmarPassword');
        const rol = formData.get('rol');

        if (!nombre || !email || !password || !confirmarPassword || !rol) {
            return {
                success: false,
                error: 'Todos los campos son obligatorios.'
            };
        }

        const nombreTexto = String(nombre).trim();
        const emailTexto = String(email).trim().toLowerCase();
        const passwordTexto = String(password);
        const confirmarPasswordTexto = String(confirmarPassword);
        const rolTexto = String(rol);

        if (!nombreTexto) {
            return {
                success: false,
                error: 'El nombre no puede estar vacío.'
            };
        }

        if (passwordTexto.length < 6) {
            return {
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres.'
            };
        }

        if (passwordTexto !== confirmarPasswordTexto) {
            return {
                success: false,
                error: 'Las contraseñas no coinciden.'
            };
        }

        if (!['admin', 'aprendiz'].includes(rolTexto)) {
            return {
                success: false,
                error: 'El rol seleccionado no es válido.'
            };
        }

        const { data: usuarioAuth, error: errorAuth } =
            await supabaseAdmin.auth.admin.createUser({
                email: emailTexto,
                password: passwordTexto,
                email_confirm: true,
                user_metadata: {
                    nombre: nombreTexto,
                    rol: rolTexto
                }
            });
        if (errorAuth) {
            console.error('ERROR COMPLETO AL CREAR USUARIO:', errorAuth);
        
            return {
                success: false,
                error: `Error al crear usuario: ${errorAuth.message}`
            };
        }

        if (!usuarioAuth.user) {
            return {
                success: false,
                error: 'No fue posible crear el usuario.'
            };
        }

        return {
            success: true,
            message: 'Usuario creado correctamente.'
        };
    },

    // =========================
    // EDITAR USUARIO
    // =========================
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

        const nombreTexto = String(nombre).trim();
        const rolTexto = String(rol);

        if (!nombreTexto) {
            return {
                success: false,
                error: 'El nombre no puede estar vacío.'
            };
        }

        if (!['admin', 'aprendiz'].includes(rolTexto)) {
            return {
                success: false,
                error: 'El rol seleccionado no es válido.'
            };
        }

        const { data, error } = await locals.supabase
            .from('profiles')
            .update({
                nombre: nombreTexto,
                rol: rolTexto
            })
            .eq('id', String(id));

        if (error) {
            console.error('Error Supabase al editar:', error);

            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: true,
            message: 'Usuario actualizado correctamente.'
        };
    },


    // =========================
    // ELIMINAR USUARIO
    // =========================
    eliminar: async ({ request, locals }) => {

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

        if (!id) {
            return {
                success: false,
                error: 'No se recibió el usuario a eliminar.'
            };
        }

        // Evita que el administrador se elimine a sí mismo
        if (String(id) === locals.user.id) {
            return {
                success: false,
                error: 'No puedes eliminar tu propio usuario.'
            };
        }

        const { error } = await supabaseAdmin.auth.admin.deleteUser(String(id));

		if (error) {
			console.error('Error al eliminar usuario en auth:', error);
			return fail(500, {
				success: false,
				error: error.message || 'No se pudo eliminar el usuario del sistema de autenticación.'
			});
		}

		return {
			success: true,
			message: 'Usuario eliminado correctamente.'
		};
	}
};