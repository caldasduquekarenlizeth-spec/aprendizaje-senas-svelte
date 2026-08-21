
export const load = async ({locals}) => {
        const {data:usuarios} = await locals.supabase
        .from('profiles')
        .select('id,nombre,email,rol,created_at')
        .order('created_at', {ascending:false});

        return { usuarios };
    };

    export const actions = {
        updateRole: async ({ request, locals }) => {
            const formData = await request.formData();
            const userId = formData.get('userId');
            const newRole = formData.get('role'); //admin o aprendiz

            const { error } = await locals.supabase
                .from('profiles')
                .update({ rol: newRole })
                .eq('id', userId);
            
                if (error) {
                    return { success: false, error:error.message };
                }

                return {success: true};
        }
    }