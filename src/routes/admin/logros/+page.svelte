<script>
    import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();

	// Lista reactiva derivada de los datos devueltos por el servidor
	let logros = $derived(data.logros || []);
	let resumen = $derived(data.resumen || { totalLogros: 0, totalXP: 0 });

    // Estados de ventana flotante (Modal)
	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');

    // Estado del formulario
	let form = $state({
		id: null,
		titulo: '',
		descripcion: '',
		tipo: 'leccion',
		puntos_xp: 0
	});

	// Mapeo dinámico de iconos según el tipo de logro
	const ICONOS = {
		leccion: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />`,
		racha: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,                
		senas: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>`,
		nivel: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />`,
		dificultad: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />`,
		exploracion: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
	};

	// Icono por defecto en caso de no coincidencia
	const ICONO_DEFECTO = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`;

	// @ts-ignore
	function getIconoSvg(tipo) {
		// @ts-ignore
		return ICONOS[tipo] || ICONO_DEFECTO;
	}

    function openCreateModal() {
		form = { id: null, titulo: '', descripcion: '', tipo: 'leccion', puntos_xp: 50 };
		errorMessage = '';
		isModalOpen = true;
	}

	// @ts-ignore
	function openEditModal(logro) {
		form = { ...logro };
		errorMessage = '';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	// @ts-ignore
	async function handleSubmit(e) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';

		try {
			if (form.id) {
				const { error } = await supabase
					.from('logros')
					.update({
						titulo: form.titulo,
						descripcion: form.descripcion,
						tipo: form.tipo,
						puntos_xp: form.puntos_xp
					})
					.eq('id', form.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from('logros').insert([
					{
						titulo: form.titulo,
						descripcion: form.descripcion,
						tipo: form.tipo,
						puntos_xp: form.puntos_xp
					}
				]);
				if (error) throw error;
			}

			await invalidateAll();
			closeModal();
		} catch (err) {
			// @ts-ignore
			errorMessage = err.message || 'Error al guardar el logro.';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete() {
		if (!confirm('¿Estás seguro de que deseas eliminar este logro?')) return;
		isLoading = true;
		try {
			const { error } = await supabase.from('logros').delete().eq('id', form.id);
			if (error) throw error;

			await invalidateAll();
			closeModal();
		} catch (err) {
			// @ts-ignore
			errorMessage = err.message || 'Error al eliminar el logro.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="logros-container">
	<header class="header-section">
		<div class="title-group">
			<h1 class="main-title">Logros y Medallas</h1>
			<p class="subtitle">Edita, borra o añade nuevos logros y medallas.</p>
		</div>

		<!-- Tarjeta de Resumen -->
		<aside class="summary-card">
			<h2 class="summary-title">Resumen de Recompensas</h2>
			<div class="summary-row">
				<span>Total de logros</span>
				<span class="summary-value">{resumen.totalLogros}</span>
			</div>
			<div class="summary-row">
				<span>Puntaje máximo</span>
				<span class="summary-value">{resumen.totalXP.toLocaleString()} XP</span>
			</div>
		</aside>
	</header>

	<div class="actions-bar">
		<button class="btn-primary" onclick={openCreateModal}>Añadir</button>
	</div>

	<!-- Grilla de Logros Dinámica -->
	<div class="achievements-grid">
		{#each logros as logro (logro.id)}
			<article class="achievement-card">
				<div class="icon-wrapper">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon-svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{@html getIconoSvg(logro.tipo)}
					</svg>
				</div>

				<h3 class="achievement-title">{logro.titulo}</h3>
				<p class="achievement-description">{logro.descripcion}</p>

				<button class="btn-secondary" onclick={() => openEditModal(logro)}>Editar</button>
			</article>
		{:else}
			<div class="empty-state">
				No se encontraron logros registrados en la base de datos.
			</div>
		{/each}
	</div>
</div>

<!-- Ventana Flotante Modal (Overlay) -->
{#if isModalOpen}
	<!-- Elemento interactivo para cerrar al presionar fuera -->
	<div
		class="modal-backdrop"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		tabindex="-1"
		role="button"
		aria-label="Cerrar ventana emergente"
	></div>

	<div class="modal-container" role="dialog" aria-modal="true">
		<div class="modal-header">
			<h2>{form.id ? 'Editar Logro' : 'Añadir Nuevo Logro'}</h2>
			<button class="close-btn" onclick={closeModal} aria-label="Cerrar">&times;</button>
		</div>

		{#if errorMessage}
			<div class="error-banner">{errorMessage}</div>
		{/if}

		<form onsubmit={handleSubmit} class="modal-form">
			<div class="form-group">
				<label for="titulo">Título del logro</label>
				<input
					id="titulo"
					type="text"
					bind:value={form.titulo}
					placeholder="Ej. Primera lección"
					required
				/>
			</div>

			<div class="form-group">
				<label for="descripcion">Descripción</label>
				<textarea
					id="descripcion"
					bind:value={form.descripcion}
					placeholder="Ej. Completaste tu primer módulo interactivo."
					rows="3"
					required
				></textarea>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="tipo">Tipo de Logro (Icono)</label>
					<select id="tipo" bind:value={form.tipo}>
						<option value="leccion">Lección</option>
						<option value="racha">Racha</option>
						<option value="senas">Señas</option>
						<option value="nivel">Nivel</option>
						<option value="perfeccionista">Perfeccionista</option>
						<option value="explorador">Explorador</option>
					</select>
				</div>

				<div class="form-group">
					<label for="xp">Recompensa (XP)</label>
					<input id="xp" type="number" bind:value={form.puntos_xp} min="0" required />
				</div>
			</div>

			<div class="modal-actions">
				{#if form.id}
					<button
						type="button"
						class="btn-delete"
						onclick={handleDelete}
						disabled={isLoading}
					>
						Eliminar
					</button>
				{/if}

				<div class="right-buttons">
					<button type="button" class="btn-cancel" onclick={closeModal}>Cancelar</button>
					<button type="submit" class="btn-save" disabled={isLoading}>
						{isLoading ? 'Guardando...' : 'Guardar'}
					</button>
				</div>
			</div>
		</form>
	</div>
{/if}

<style>
	/* Layout principal */
	.logros-container {
		padding: 2rem;
		background-color: #fbfbfa;
		min-height: 100vh;
		color: #1a3826;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	/* Encabezado */
	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.main-title {
		font-size: 1.875rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: #143d23;
		margin: 0;
	}

	.subtitle {
		color: #6b7280;
		margin-top: 0.25rem;
		font-size: 0.95rem;
	}

	/* Tarjeta de Resumen */
	.summary-card {
		background-color: #ffffff;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		border: 1px solid #f3f4f6;
		width: 20rem;
	}

	.summary-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #143d23;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: #4b5563;
		margin-bottom: 0.75rem;
	}

	.summary-row:last-child {
		margin-bottom: 0;
	}

	.summary-value {
		font-weight: 700;
		color: #143d23;
	}

	/* Botones y Acciones */
	.actions-bar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1.5rem;
	}

	.btn-primary {
		background-color: #7ac70c;
		color: #ffffff;
		padding: 0.5rem 1.5rem;
		border-radius: 9999px;
		font-weight: 500;
		border: none;
		cursor: pointer;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition: background-color 0.2s ease;
	}

	.btn-primary:hover {
		background-color: #6cb30a;
	}

	.btn-secondary {
		margin-top: 0.5rem;
		background-color: #7ac70c;
		color: #ffffff;
		font-size: 0.75rem;
		padding: 0.375rem 1.5rem;
		border-radius: 9999px;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.btn-secondary:hover {
		background-color: #6cb30a;
	}

	/* Grilla de Logros */
	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 1.5rem;
		max-width: 56rem;
	}

	@media (min-width: 768px) {
		.achievements-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* Tarjeta Individual de Logro */
	.achievement-card {
		background-color: #ffffff;
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid #f3f4f6;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.75rem;
		transition: box-shadow 0.2s ease;
	}

	.achievement-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	/* Iconos */
	.icon-wrapper {
		width: 4rem;
		height: 4rem;
		border-radius: 9999px;
		background-color: #f2f9e8;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #2d6a3f;
	}

	.icon-svg {
		width: 2rem;
		height: 2rem;
	}

	/* Textos */
	.achievement-title {
		font-weight: 700;
		font-size: 1.125rem;
		color: #143d23;
		margin: 0;
	}

	.achievement-description {
		font-size: 0.75rem;
		color: #6b7280;
		max-width: 20rem;
		margin: 0;
	}

	.empty-state {
		grid-column: span 2 / span 2;
		text-align: center;
		padding: 3rem 0;
		color: #9ca3af;
	}

    .modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 40;
		backdrop-filter: blur(2px);
	}

	.modal-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		max-width: 32rem;
		background-color: #ffffff;
		border-radius: 1.25rem;
		padding: 1.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
		z-index: 50;
		color: #1a3826;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #143d23;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #9ca3af;
		cursor: pointer;
		line-height: 1;
	}

	.close-btn:hover {
		color: #111827;
	}

	.error-banner {
		background-color: #fee2e2;
		color: #991b1b;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
	}

	.form-group label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #374151;
	}

	.form-group input,
	.form-group textarea,
	.form-group select {
		padding: 0.6rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.form-group input:focus,
	.form-group textarea:focus,
	.form-group select:focus {
		border-color: #7ac70c;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.modal-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #f3f4f6;
	}

	.right-buttons {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.btn-cancel {
		background: transparent;
		border: 1px solid #d1d5db;
		color: #4b5563;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.btn-save {
		background-color: #7ac70c;
		border: none;
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-save:hover {
		background-color: #6cb30a;
	}

	.btn-delete {
		background-color: #ef4444;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.btn-delete:hover {
		background-color: #dc2626;
	}
</style>