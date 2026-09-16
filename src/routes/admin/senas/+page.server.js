export const load = async ({ locals: { supabase } }) => {
	const { data: signs, error } = await supabase
		.from('signs')
		.select('*')
		.order('nombre', { ascending: true });

	if (error) {
		console.error('Error al cargar las señas:', error);
	}

	return {
		signs: signs || []
	};
};