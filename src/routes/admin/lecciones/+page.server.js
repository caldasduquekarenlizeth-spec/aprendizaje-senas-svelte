import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
    // 1. Obtener módulos
    const { data: modules, error: modError } = await supabase
        .from('modules')
        .select('id, nombre')
        .order('id', { ascending: true });

    if (modError) console.error('Error al cargar módulos:', modError);

    // 2. Obtener lecciones con sus ejercicios anidados
    const { data: lessons, error: lessError } = await supabase
		.from('lessons')
		.select(`
			id,
			module_id,
			titulo,
			descripcion,
			tipo,
			puntos_xp,
			orden,
			modules ( id, nombre ),
			exercises ( * )
		`)
		.order('orden', { ascending: true });

    // 3. Obtener señas registradas
    const { data: signs } = await supabase
		.from('signs')
		.select('id, nombre, imagen_url, categoria')
		.order('nombre', { ascending: true });

    if (lessError) console.error('Error al cargar lecciones:', lessError);

    return {
        modules: modules || [],
        lessons: lessons || [],
        signs: signs || []
    };
};