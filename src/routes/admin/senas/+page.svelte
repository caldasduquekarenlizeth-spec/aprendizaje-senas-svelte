<script>
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();

	let signs = $derived(data?.signs || []);

	// Filtros y Buscador
	let searchTerm = $state('');
	let selectedCategory = $state('Todas');

	// Estados del Modal
	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Formulario de Seña
	let form = $state({
		id: null,
		nombre: '',
		descripcion: '',
		imagen_url: '',
		categoria: 'Alfabeto'
	});

	// Categorías únicas extraídas de los datos
	let categories = $derived([
		'Todas',
		...new Set(signs.map((s) => s.categoria).filter(Boolean))
	]);

	// Filtrar señas por búsqueda y categoría
	let filteredSigns = $derived(
		signs.filter((sign) => {
			const matchesSearch = sign.nombre.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === 'Todas' || sign.categoria === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	function openModal(sign = null) {
		errorMessage = '';
		if (sign) {
			form = { ...sign };
		} else {
			form = {
				id: null,
				nombre: '',
				descripcion: '',
				imagen_url: '',
				categoria: 'Alfabeto'
			};
		}
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!form.nombre.trim() || !form.imagen_url.trim()) {
			errorMessage = 'El nombre y la URL de la imagen son obligatorios.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const payload = {
				nombre: form.nombre.trim(),
				descripcion: form.descripcion.trim(),
				imagen_url: form.imagen_url.trim(),
				categoria: form.categoria || 'General'
			};

			if (form.id) {
				const { error } = await supabase.from('signs').update(payload).eq('id', form.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from('signs').insert([payload]);
				if (error) throw error;
			}

			await invalidateAll();
			closeModal();
		} catch (err) {
			console.error('Error al guardar seña:', err);
			errorMessage = err.message || 'Error al guardar la seña en la base de datos.';
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Estás seguro de que deseas eliminar esta seña?')) return;

		try {
			const { error } = await supabase.from('signs').delete().eq('id', id);
			if (error) throw error;
			await invalidateAll();
		} catch (err) {
			alert('Error al eliminar: ' + err.message);
		}
	}
</script>

<div class="page-container">
	<header class="header-section">
		<div>
			<h1 class="main-title">Gestión de Señas</h1>
			<p class="subtitle">Administra la biblioteca de imágenes de la Lengua de Señas Colombiana.</p>
		</div>
		<button class="btn-create" onclick={() => openModal()}>
			+ Nueva Seña
		</button>
	</header>

	<!-- Barra de Búsqueda y Filtros -->
	<div class="controls-bar">
		<div class="search-box">
			<span class="search-icon">🔍</span>
			<input
				type="text"
				placeholder="Buscar seña por nombre..."
				bind:value={searchTerm}
			/>
		</div>

		<div class="filter-categories">
			{#each categories as cat}
				<button
					class="cat-btn {selectedCategory === cat ? 'active' : ''}"
					onclick={() => (selectedCategory = cat)}
				>
					{cat}
				</button>
			{/each}
		</div>
	</div>

	<!-- Grilla de Señas -->
	<div class="signs-grid">
		{#each filteredSigns as sign (sign.id)}
			<article class="sign-card">
				<div class="image-container">
					<img src={sign.imagen_url} alt={sign.nombre} loading="lazy" />
					<span class="category-tag">{sign.categoria || 'General'}</span>
				</div>

				<div class="card-content">
					<h3 class="sign-name">{sign.nombre}</h3>
					<p class="sign-desc">{sign.descripcion || 'Sin descripción asignada.'}</p>
				</div>

				<div class="card-actions">
					<button class="btn-edit" onclick={() => openModal(sign)}>✏️ Editar</button>
					<button class="btn-delete" onclick={() => handleDelete(sign.id)}>🗑️ Eliminar</button>
				</div>
			</article>
		{:else}
			<div class="empty-state">
				No se encontraron señas registradas.
			</div>
		{/each}
	</div>
</div>

<!-- Modal Formulario -->
{#if isModalOpen}
	<div
		class="modal-backdrop"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		tabindex="-1"
		role="button"
		aria-label="Cerrar modal"
	></div>

	<div class="modal-container" role="dialog" aria-modal="true">
		<div class="modal-header">
			<h2>{form.id ? 'Editar Seña' : 'Nueva Seña'}</h2>
			<button class="close-btn" onclick={closeModal}>&times;</button>
		</div>

		{#if errorMessage}
			<div class="error-banner">{errorMessage}</div>
		{/if}

		<form onsubmit={handleSubmit} class="modal-form">
			<div class="form-row">
				<div class="form-group flex-2">
					<label for="sign-name">Nombre / Palabra</label>
					<input
						id="sign-name"
						type="text"
						bind:value={form.nombre}
						placeholder="Ej. Vocal A, Hola, Familia"
						required
					/>
				</div>

				<div class="form-group flex-1">
					<label for="sign-cat">Categoría</label>
					<select id="sign-cat" bind:value={form.categoria}>
						<option value="Alfabeto">Alfabeto</option>
						<option value="Saludos">Saludos</option>
						<option value="Colores">Colores</option>
						<option value="Familia">Familia</option>
						<option value="Números">Números</option>
						<option value="General">General</option>
					</select>
				</div>
			</div>

			<div class="form-group">
				<label for="sign-url">URL de la Imagen</label>
				<input
					id="sign-url"
					type="url"
					bind:value={form.imagen_url}
					placeholder="https://ejemplo.com/imagen.jpg"
					required
				/>
			</div>

			<!-- Vista previa de la imagen si hay una URL ingresada -->
			{#if form.imagen_url}
				<div class="preview-box">
					<span>Vista previa:</span>
					<img src={form.imagen_url} alt="Vista previa" />
				</div>
			{/if}

			<div class="form-group">
				<label for="sign-desc">Descripción o Instrucción</label>
				<textarea
					id="sign-desc"
					bind:value={form.descripcion}
					rows="2"
					placeholder="Ej. Puño cerrado con el pulgar apoyado al lado del índice."
				></textarea>
			</div>

			<div class="modal-actions">
				<button type="button" class="btn-cancel" onclick={closeModal}>Cancelar</button>
				<button type="submit" class="btn-save" disabled={isLoading}>
					{isLoading ? 'Guardando...' : 'Guardar Seña'}
				</button>
			</div>
		</form>
	</div>
{/if}

<style>
	/* Contenedor Principal */
	.page-container {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #1a3826;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.main-title {
		font-size: 2.25rem;
		font-weight: 800;
		color: #143d23;
		margin: 0;
		letter-spacing: -0.025em;
	}

	.subtitle {
		font-size: 1rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.btn-create {
		background-color: #7ac70c;
		color: #ffffff;
		border: none;
		padding: 0.65rem 1.25rem;
		border-radius: 0.75rem;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-create:hover {
		background-color: #6cb30a;
	}

	/* Búsqueda y Filtros */
	.controls-bar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 640px) {
		.controls-bar {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.search-box {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 0.5rem 0.85rem;
		gap: 0.5rem;
		width: 100%;
		max-width: 20rem;
	}

	.search-box input {
		border: none;
		outline: none;
		width: 100%;
		font-size: 0.875rem;
	}

	.filter-categories {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding-bottom: 0.2rem;
	}

	.cat-btn {
		background-color: #ffffff;
		border: 1px solid #e5e7eb;
		color: #4b5563;
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
	}

	.cat-btn.active {
		background-color: #143d23;
		color: #ffffff;
		border-color: #143d23;
	}

	/* Grilla de Tarjetas */
	.signs-grid {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.signs-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.signs-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.sign-card {
		background-color: #ffffff;
		border: 1px solid #eef0f2;
		border-radius: 1.25rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.sign-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.image-container {
		position: relative;
		width: 100%;
		height: 12rem;
		background-color: #f9fafb;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-container img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		padding: 1rem;
	}

	.category-tag {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background-color: #f2f9e8;
		color: #2d6a3f;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
	}

	.card-content {
		padding: 1rem 1.25rem;
		flex: 1;
	}

	.sign-name {
		font-size: 1.125rem;
		font-weight: 700;
		color: #143d23;
		margin: 0 0 0.3rem 0;
	}

	.sign-desc {
		font-size: 0.8rem;
		color: #6b7280;
		margin: 0;
		line-height: 1.3;
	}

	.card-actions {
		padding: 0.75rem 1.25rem;
		border-top: 1px solid #f3f4f6;
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.btn-edit, .btn-delete {
		border: none;
		padding: 0.4rem 0.8rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-edit {
		background-color: #e0e7ff;
		color: #3730a3;
	}

	.btn-delete {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem;
		color: #9ca3af;
		background-color: #ffffff;
		border-radius: 1.25rem;
	}

	/* Modal Flotante */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
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
		max-height: 85vh;
		background-color: #ffffff;
		border-radius: 1.25rem;
		padding: 1.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		z-index: 50;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
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
	}

	.error-banner {
		background-color: #fee2e2;
		color: #991b1b;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.form-group label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #374151;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 0.55rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		outline: none;
	}

	.form-row {
		display: flex;
		gap: 0.75rem;
	}

	.flex-1 { flex: 1; }
	.flex-2 { flex: 2; }

	.preview-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: #f9fafb;
		border: 1px dashed #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.preview-box img {
		max-height: 6rem;
		object-fit: contain;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.btn-cancel {
		background: none;
		border: 1px solid #d1d5db;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.btn-save {
		background-color: #7ac70c;
		border: none;
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-save:hover {
		background-color: #6cb30a;
	}
</style>