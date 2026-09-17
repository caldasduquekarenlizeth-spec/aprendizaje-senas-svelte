<script>
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let { data } = $props();

	let modules = $derived(data?.modules || []);
    let signs = $derived(data?.signs || []);
	let lessons = $derived(data?.lessons || []);

	let selectedModuleFilter = $state('todos');
    let filteredLessons = $derived(
		selectedModuleFilter === 'todos'
			? lessons
			: lessons.filter(
					(l) => String(l.module_id) === String(selectedModuleFilter)
			)
	);
	let isModalOpen = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');

	/** @typedef {{ pregunta: string, opcion1: string, opcion2: string, opcion3: string, respuesta_correcta: string }} Exercise */
	/** @type {{ id: any, module_id: any, titulo: string, descripcion: string, tipo: string, puntos_xp: number, exercises: Exercise[] }} */
	// Estado del formulario
	let form = $state({
		id: null,
		module_id: '',
		titulo: '',
		descripcion: '',
		tipo: 'Lección',
		puntos_xp: 10,
		exercises: []
	});

	let currentModuleName = $derived(
		selectedModuleFilter === 'todos'
			? 'Todos los módulos'
			: modules.find((m) => m.id === selectedModuleFilter)?.nombre || 'Módulo seleccionado'
	);

	/** @param {any} lesson */
	function openModal(lesson = null) {
		errorMessage = '';

        const defaultModuleId = modules.length > 0 ? modules[0].id : '';

		if (lesson) {
			form = {
				id: lesson.id,
				module_id: lesson.module_id || defaultModuleId,
				titulo: lesson.titulo,
				descripcion: lesson.descripcion || '',
				tipo: lesson.tipo || 'Lección',
				puntos_xp: lesson.puntos_xp ?? 10,
				exercises: lesson.exercises
                ? lesson.exercises.map((ex) => {
                        let opts = [];
                        if (Array.isArray(ex.opciones)) {
                            opts = ex.opciones;
                        } else if (typeof ex.opciones === 'string') {
                            try { opts = JSON.parse(ex.opciones); } catch (e) { opts = []; }
                        }

                        return {
                            pregunta: ex.pregunta || '',
                            opcion1: opts[0] || ex.opcion1 || '',
                            opcion2: opts[1] || ex.opcion2 || '',
                            opcion3: opts[2] || ex.opcion3 || '',
                            respuesta_correcta: ex.respuesta_correcta || ''
                        };
                    })
                : []
        };
		} else {
			form = {
				id: null,
				module_id: modules.length > 0 ? modules[0].id : '',
				titulo: '',
				descripcion: '',
				tipo: 'Lección',
				puntos_xp: 10,
				exercises: [{ pregunta: '', opcion1: '', opcion2: '', opcion3: '', respuesta_correcta: '' }]
			};
		}
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function addExercise() {
		form.exercises = [
			...form.exercises,
			{ pregunta: '', opcion1: '', opcion2: '', opcion3: '', respuesta_correcta: '' }	
		];
	}

	// @ts-ignore
	function removeExercise(index) {
		form.exercises = form.exercises.filter((_, i) => i !== index);
	}

	// @ts-ignore
	async function handleSubmit(e) {
		e.preventDefault();
		if (!form.module_id) {
			errorMessage = 'Debes seleccionar un módulo.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const lessonPayload = {
				module_id: form.module_id,
				titulo: form.titulo,
				descripcion: form.descripcion,
				tipo: form.tipo,
				puntos_xp: Number(form.puntos_xp) || 10
			};

			let lessonId = form.id;

			if (lessonId) {
				const { error } = await supabase.from('lessons').update(lessonPayload).eq('id', lessonId);
				if (error) throw error;
			} else {
				const { data: newLesson, error } = await supabase
					.from('lessons')
					.insert([lessonPayload])
					.select()
					.single();
				if (error) throw error;
				lessonId = newLesson.id;
			}

			if (form.id) {
				await supabase.from('exercises').delete().eq('lesson_id', lessonId);
			}

			if (form.exercises.length > 0) {
				const exercisesPayload = form.exercises.map((ex, idx) => ({
					lesson_id: lessonId,
					pregunta: ex.pregunta,
					tipo: 'opcion_multiple',
					opciones: [ex.opcion1, ex.opcion2, ex.opcion3].filter(Boolean),
					respuesta_correcta: ex.respuesta_correcta,
					orden: idx + 1
				}));

				const { error: exError } = await supabase.from('exercises').insert(exercisesPayload);
				if (exError) throw exError;
			}

			await invalidateAll();
			closeModal();
		} catch (err) {
			console.error(err);
			errorMessage = err.message || 'Error al guardar la lección.';
		} finally {
			isLoading = false;
		}
	}

	// @ts-ignore
	async function handleDelete(id) {
		if (!confirm('¿Deseas eliminar esta lección y sus ejercicios?')) return;

		try {
			const { error } = await supabase.from('lessons').delete().eq('id', id);
			if (error) throw error;
			await invalidateAll();
		} catch (err) {
			// @ts-ignore
			alert('Error al eliminar: ' + err.message);
		}
	}

</script>

<div class="page-container">
	<!-- Enlace de regreso -->
	<a href="/admin/modulos" class="back-link">
		<svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
		</svg>
		Volver a módulos
	</a>

	<!-- Encabezado de la página -->
	<header class="header-section">
		<h1 class="main-title">Gestionar lecciones</h1>
		<p class="subtitle">{currentModuleName}</p>
	</header>

	<!-- Filtro por módulo -->
	<div class="filter-section">
		<button
			class="filter-btn {selectedModuleFilter === 'todos' ? 'active' : ''}"
			onclick={() => (selectedModuleFilter = 'todos')}
		>
			Todas
		</button>
		{#each modules as mod}
			<button
				class="filter-btn {selectedModuleFilter === mod.id ? 'active' : ''}"
				onclick={() => (selectedModuleFilter = mod.id)}
			>
				{mod.nombre}
			</button>
		{/each}
	</div>

	<!-- Lista de lecciones -->
	<div class="lessons-list">
		{#each filteredLessons as lesson, index (lesson.id)}
			<article class="lesson-card">
				<div class="card-left">
					<div class="number-badge">{index + 1}</div>
					<div class="lesson-info">
						<div class="title-row">
							<h3 class="lesson-title">{lesson.titulo}</h3>
							<span class="type-badge {lesson.tipo === 'Práctica' ? 'badge-practica' : 'badge-leccion'}">
								{lesson.tipo || 'Lección'}
							</span>
						</div>
						<p class="lesson-desc">{lesson.descripcion || 'Sin descripción disponible.'}</p>
					</div>
				</div>

				<div class="card-actions">
					<button class="btn-action edit-btn" onclick={() => openModal(lesson)}>
						✏️ Editar
					</button>
					<button class="btn-action delete-btn" onclick={() => handleDelete(lesson.id)}>
						🗑️ Eliminar
					</button>
				</div>
			</article>
		{:else}
			<div class="empty-state">No hay lecciones registradas en este módulo.</div>
		{/each}
	</div>

	<!-- Botón Crear Nueva Lección -->
	<div class="bottom-action">
		<button class="btn-create" onclick={() => openModal()}>
			+ Crear nueva lección
		</button>
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
			<h2>{form.id ? 'Editar Lección' : 'Nueva Lección'}</h2>
			<button class="close-btn" onclick={closeModal}>&times;</button>
		</div>

		{#if errorMessage}
			<div class="error-banner">{errorMessage}</div>
		{/if}

		<form onsubmit={handleSubmit} class="modal-form">
			<div class="form-group">
				<label for="modal-module">Módulo al que pertenece</label>
				<select id="modal-module" bind:value={form.module_id} required>
                    {#if modules.length === 0}
                        <option value="" disabled selected>No hay módulos disponibles</option>
                    {:else}
                        <option value="" disabled>Selecciona un módulo</option>
                        {#each modules as mod (mod.id)}
							<option value={mod.id}>{mod.nombre}</option>
                        {/each}
                    {/if}
				</select>
			</div>

			<div class="form-row">
				<div class="form-group flex-2">
					<label for="modal-title">Título de la lección</label>
					<input id="modal-title" type="text" bind:value={form.titulo} placeholder="Ej. Lección 1: Vocales" required />
				</div>
				<div class="form-group flex-1">
					<label for="modal-tipo">Tipo</label>
					<select id="modal-tipo" bind:value={form.tipo}>
						<option value="leccion">Lección</option>
						<option value="practica">Práctica</option>
					</select>
				</div>
				<div class="form-group flex-1">
					<label for="modal-xp">Puntos XP</label>
					<input id="modal-xp" type="number" min="1" max="500" bind:value={form.puntos_xp} required />
				</div>
			</div>

			<div class="form-group">
				<label for="modal-desc">Descripción</label>
				<textarea id="modal-desc" bind:value={form.descripcion} rows="2" placeholder="Ej. Aprende las señas de las cinco vocales." style="resize: none"></textarea>
			</div>

			<hr class="divider" />

			<!-- Ejercicios -->
			<div class="exercises-section">
				<div class="exercises-header">
					<h3>Ejercicios de la lección</h3>
					<button type="button" class="btn-add-exercise" onclick={addExercise}>
						+ Añadir Ejercicio
					</button>
				</div>

				{#each form.exercises as ex, index}
					<div class="exercise-card">
						<div class="exercise-card-header">
							<span>Ejercicio #{index + 1}</span>
							{#if form.exercises.length > 1}
								<button type="button" class="btn-remove-ex" onclick={() => removeExercise(index)}>Quitar</button>
							{/if}
						</div>

						<input 
                            id="modal-title" 
                            class="exercise-input" 
                            type="text" 
                            placeholder="Pregunta (ej: ¿Qué seña representa la letra A?)" 
                            bind:value={ex.pregunta} 
                            required 
                        />

                        <p class="select-label">Selecciona las señas para las opciones:</p>

						<div class="options-grid">
							<!-- Opción 1 -->
							<select bind:value={ex.opcion1} required>
								<option value="" disabled selected>Opción 1 (Seña)</option>
								{#each signs as sign (sign.id)}
									<option value={sign.nombre}>{sign.nombre} ({sign.categoria})</option>
								{/each}
							</select>

							<!-- Opción 2 -->
							<select bind:value={ex.opcion2} required>
								<option value="" disabled selected>Opción 2 (Seña)</option>
								{#each signs as sign (sign.id)}
									<option value={sign.nombre}>{sign.nombre} ({sign.categoria})</option>
								{/each}
							</select>

							<!-- Opción 3 -->
							<select bind:value={ex.opcion3} required>
								<option value="" disabled selected>Opción 3 (Seña)</option>
								{#each signs as sign (sign.id)}
									<option value={sign.nombre}>{sign.nombre} ({sign.categoria})</option>
								{/each}
							</select>
						</div>

						<div class="correct-section">
							<label for="correct-select-{index}">Respuesta Correcta:</label>
							<select id="correct-select-{index}" bind:value={ex.respuesta_correcta} class="correct-input" required>
								<option value="" disabled selected>Elige la seña correcta...</option>
								{#if ex.opcion1}<option value={ex.opcion1}>{ex.opcion1}</option>{/if}
								{#if ex.opcion2}<option value={ex.opcion2}>{ex.opcion2}</option>{/if}
								{#if ex.opcion3}<option value={ex.opcion3}>{ex.opcion3}</option>{/if}
							</select>
						</div>
					</div>
				{:else}
					<p class="empty-exercises">Haz clic en "+ Añadir Ejercicio" para crear preguntas.</p>
				{/each}
			</div>

			<div class="modal-actions">
				<button type="button" class="btn-cancel" onclick={closeModal}>Cancelar</button>
				<button type="submit" class="btn-save" disabled={isLoading}>
					{isLoading ? 'Guardando...' : 'Guardar Lección'}
				</button>
			</div>
		</form>
	</div>
{/if}

<style>
	/* Layout principal */
	.page-container {
		max-width: 54rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #1a3826;
	}

	/* Link Volver */
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #2d6a3f;
		text-decoration: none;
		margin-bottom: 1.25rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.arrow-icon {
		width: 1rem;
		height: 1rem;
	}

	/* Encabezados */
	.header-section {
		margin-bottom: 1.5rem;
	}

	.main-title {
		font-size: 2.25rem;
		font-weight: 800;
		color: #143d23;
		margin: 0;
		letter-spacing: -0.025em;
	}

	.subtitle {
		font-size: 1.125rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	/* Filtros */
	.filter-section {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
	}

	.filter-btn {
		background-color: #ffffff;
		border: 1px solid #e5e7eb;
		color: #4b5563;
		padding: 0.4rem 1.1rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-btn.active {
		background-color: #143d23;
		color: #ffffff;
		border-color: #143d23;
	}

	/* Lista de tarjetas */
	.lessons-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.lesson-card {
		background-color: #ffffff;
		border: 1px solid #eef0f2;
		border-radius: 1.25rem;
		padding: 1.25rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.card-left {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	/* Número en la tarjeta */
	.number-badge {
		width: 2.75rem;
		height: 2.75rem;
		background-color: #f2f9e8;
		color: #143d23;
		border-radius: 0.875rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 800;
	}

	.lesson-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.lesson-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #143d23;
		margin: 0;
	}

	/* Insignias */
	.type-badge {
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.15rem 0.55rem;
		border-radius: 9999px;
	}

	.badge-leccion {
		background-color: #eaf5ea;
		color: #2d6a3f;
	}

	.badge-practica {
		background-color: #fef3c7;
		color: #d97706;
	}

	.lesson-desc {
		font-size: 0.925rem;
		color: #6b7280;
		margin: 0;
	}

	/* Botones de acción */
	.card-actions {
		display: flex;
		gap: 0.6rem;
	}

	.btn-action {
		border: none;
		padding: 0.45rem 0.9rem;
		border-radius: 0.6rem;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.edit-btn {
		background-color: #d7ffc3;
		color: #39A900;
	}

	.delete-btn {
		background-color: #fee2e2;
		color: #FC7314;
	}

	/* Botón Crear */
	.bottom-action {
		margin-top: 1rem;
	}

	.btn-create {
		background-color: #39A900;
		color: #ffffff;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.75rem;
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-create:hover {
		background-color: #40be01;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #9ca3af;
		background: #ffffff;
		border-radius: 1rem;
	}

	/* Modal */
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
		max-width: 36rem;
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
		font-size: 0.9rem;
		font-weight: 600;
		color: #374151;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 0.55rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.975rem;
		outline: none;
	}

	.form-row {
		display: flex;
		gap: 0.75rem;
	}

	.flex-1 { flex: 1; }
	.flex-2 { flex: 2; }

	.divider {
		border: none;
		border-top: 1px solid #f3f4f6;
		margin: 0.5rem 0;
	}

	/* Ejercicios dentro del modal */
	.exercises-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.exercises-header h3 {
		font-size: 0.95rem;
		margin: 0;
		color: #143d23;
	}

	.btn-add-exercise {
		background-color: #2d6a3f;
		color: white;
		border: none;
		padding: 0.3rem 0.75rem;
		border-radius: 0.4rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.exercise-card {
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.6rem;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.exercise-card-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		font-weight: 700;
		color: #6b7280;
	}

	.btn-remove-ex {
		background: none;
		border: none;
		color: #ef4444;
		font-size: 0.75rem;
		font-weight: 700;
		cursor: pointer;
	}

	.exercise-card input {
		padding: 0.45rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 0.4rem;
		font-size: 0.9rem;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
	}

	.correct-input {
		background-color: #f0fdf4;
		border-color: #86efac !important;
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
		background-color: #39A900;
		border: none;
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

    .select-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #4b5563;
		margin: 0.25rem 0 0 0;
	}

	.options-grid select {
		padding: 0.45rem 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.4rem;
		font-size: 0.9rem;
		background-color: #ffffff;
		outline: none;
	}

	.correct-section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.correct-section label {
		font-size: 0.85rem;
		font-weight: 700;
		color: #143d23;
		white-space: nowrap;
	}

	.correct-section select {
		flex: 1;
		padding: 0.45rem 0.6rem;
		border-radius: 0.4rem;
		font-size: 0.9rem;
	}

	.empty-exercises {
		font-size: 0.8rem;
		color: #9ca3af;
		text-align: center;
		padding: 1rem 0;
	}
</style>