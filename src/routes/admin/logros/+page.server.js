import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// Consultar los logros guardados en la BD
	const { data: logros, error } = await locals.supabase
		.from('logros')
		.select('*')
		.order('titulo', { ascending: true });

	if (error) {
		console.error('Error cargando logros:', error);
	}

	// Calcular totales para la tarjeta de resumen
	const listaLogros = logros || [];
	const totalLogros = listaLogros.length;
	const totalXP = listaLogros.reduce((acc, item) => acc + (item.puntos_xp || 0), 0);

	return {
		logros: listaLogros,
		resumen: {
			totalLogros,
			totalXP
		}
	};
};

export const actions = {
	save: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const titulo = formData.get('titulo');
		const descripcion = formData.get('descripcion');
		const tipo = formData.get('tipo');
		const puntos_xp = Number(formData.get('puntos_xp')) || 0;

		const payload = { titulo, descripcion, tipo, puntos_xp };

		let error;
		if (id) {
			// Actualizar logro existente
			({ error } = await locals.supabase.from('logros').update(payload).eq('id', id));
		} else {
			// Crear nuevo logro
			({ error } = await locals.supabase.from('logros').insert(payload));
		}

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await locals.supabase.from('logros').delete().eq('id', id);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true };
	}
};
