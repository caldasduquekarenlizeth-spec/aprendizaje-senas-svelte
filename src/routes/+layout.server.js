export const load = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	return {
		session,
		user,
		// Opcional: pasar cookies si requieres contexto adicional
		cookies: cookies.getAll()
	};
};