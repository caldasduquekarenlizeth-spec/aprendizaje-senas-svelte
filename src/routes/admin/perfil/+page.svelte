<script>
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let profile = $state({
		id: '',
		nombre: '',
		email: '',
		rol: 'admin'
	});

	let isModalOpen = $state(false);
	let newNombre = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	let usuario = $state(null);
	let cargando = $state(true);


    onMount(async () => {
		const {
            data: { session }
        } = await supabase.auth.getSession();
		if (!session) {
            goto('/login');
            return;
        }
		usuario = session.user;
        cargando = false;
        try{
            const { data: { user }, error: authError}    = await supabase.auth.getUser();
            if (authError) {
				console.error('Error al obtener usuario de auth:', authError.message);
				return;
			}
            if (user) {
                // Consultar usuarios por su ID
                const { data, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, email, nombre, rol')
                    .eq('id', user.id)
                    .maybeSingle();
                
                if (profileError) {
				console.error('Error al consultar la tabla profiles:', profileError.message);
                } else if (data) {
                    profile = data;
                }
            }
	} catch (err){
        console.error('Error inesperado al cargar el perfil:', err);
    }
});

	let activityLogs = [
		{ id: 1, type: 'create', title: 'Creaste el módulo', target: '"Saludos"', time: 'Hace 2 horas', tag: 'Módulo', color: '#16a34a', bg: '#dcfce7', icon: 'plus' },
		{ id: 2, type: 'edit', title: 'Editaste la seña', target: '"Familia"', time: 'Hace 4 horas', tag: 'Seña', color: '#2563eb', bg: '#dbeafe', icon: 'edit' },
		{ id: 3, type: 'add', title: 'Agregaste un ejercicio al módulo', target: '"Colores"', time: 'Ayer', tag: 'Ejercicio', color: '#ea580c', bg: '#ffedd5', icon: 'plus' },
		{ id: 4, type: 'delete', title: 'Eliminaste la seña', target: '"Casa"', time: 'Hace 2 días', tag: 'Seña', color: '#dc2626', bg: '#fee2e2', icon: 'trash' },
		{ id: 5, type: 'publish', title: 'Publicaste el módulo', target: '"Números"', time: 'Hace 3 días', tag: 'Módulo', color: '#9333ea', bg: '#f3e8ff', icon: 'globe' },
		{ id: 6, type: 'edit', title: 'Editaste la seña', target: '"Buenos Días"', time: 'Hace 5 días', tag: 'Seña', color: '#2563eb', bg: '#dbeafe', icon: 'edit' }
	];


// Abrir modal y preparar campo de texto
	function openEditModal() {
		newNombre = profile.nombre;
		errorMessage = '';
		isModalOpen = true;
	}

	// Cerrar modal
	function closeModal() {
		isModalOpen = false;
	}

	// Guardar actualización en Supabase
	async function handleUpdateProfile(event) {
		event.preventDefault();
		if (!newNombre.trim()) {
			errorMessage = 'El nombre no puede estar vacío.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// Asegurar que tenemos un ID antes de intentar actualizar
			let currentId = profile.id;

			if (!currentId) {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) currentId = user.id;
			}

			if (!currentId) {
				throw new Error('No se encontró una sesión activa de usuario.');
			}

			// Actualizar en Supabase
			const { data, error } = await supabase
				.from('profiles')
				.update({ nombre: newNombre })
				.eq('id', currentId)
				.select(); // Devolver las filas afectadas para verificar

			if (error) {
				console.error('Error de Supabase al actualizar:', error);
				throw error;
			}

			// Si RLS bloquea la actualización, data vendrá como un arreglo vacío []
			if (data && data.length === 0) {
				console.warn('Advertencia RLS: No se actualizó ninguna fila. Revisa las políticas de seguridad en Supabase.');
			}

			// Actualizar interfaz
			profile.nombre = newNombre;
			profile.id = currentId;
			closeModal();
		} catch (err) {
			console.error('Error al guardar:', err);
			errorMessage = err.message || 'Error al actualizar el perfil en la base de datos.';
		} finally {
			isLoading = false;
		}
	}
</script>

<main class="profile-container">
	<!-- Columna Izquierda: Tarjeta de Usuario y Ajustes -->
	<aside class="sidebar">
		<!-- Card Perfil -->
		<div class="card profile-card">
			<div class="avatar-wrapper">
				<img src="/foto_perfil.svg" alt="Avatar de {profile.nombre}" class="avatar" />
			</div>
			
			<!-- Nombre del usuario / administrador dinámico -->
			<h2 class="user-name">{profile.nombre}</h2>

			<button class="btn-edit" onclick={openEditModal}>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
				Editar perfil
			</button>
		</div>

		<!-- Card Configuraciones -->
		<div class="card settings-card">
			<h3 class="settings-title">Configuraciones</h3>
			<nav class="settings-menu">
				<a href="#privacidad" class="menu-item">
					<span>Privacidad y seguridad</span>
					<svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
				</a>
				<a href="#metas" class="menu-item">
					<span>Metas de estudio</span>
					<svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
				</a>
				<a href="#notificaciones" class="menu-item">
					<span>Notificaciones de correo</span>
					<svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
				</a>
			</nav>
		</div>
	</aside>

	<!-- Columna Derecha: Historial de Actividad -->
	<section class="card main-content">
		<header class="content-header">
			<div>
				<h1 class="section-title">Historial de Actividad</h1>
				<p class="section-subtitle">Registro de las últimas acciones de administración en la plataforma</p>
			</div>
			<span class="status-badge">
				<span class="dot"></span> Activo
			</span>
		</header>

		<ul class="activity-list">
			{#each activityLogs as log (log.id)}
				<li class="activity-item">
					<div class="icon-box" style="background-color: {log.bg}; color: {log.color};">
						{#if log.icon === 'plus'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
						{:else if log.icon === 'edit'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
						{:else if log.icon === 'trash'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
						{:else if log.icon === 'globe'}
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
						{/if}
					</div>

					<div class="activity-details">
						<p class="activity-text">{log.title} <strong>{log.target}</strong></p>
						<span class="activity-time">{log.time}</span>
					</div>

					<span class="category-tag">{log.tag}</span>
				</li>
			{/each}
		</ul>
	</section>
</main>

<!-- Modal de Edición de Perfil -->
{#if isModalOpen}
	<!-- Usamos el elemento nativo <dialog> o añadimos los atributos a11y requeridos -->
	<div 
		class="modal-backdrop" 
		onclick={closeModal} 
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="-1"
	>
		<div 
			class="modal-card" 
			onclick={(e) => e.stopPropagation()} 
			onkeydown={(e) => e.stopPropagation()}
			role="dialog" 
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<header class="modal-header">
				<h2 id="modal-title">Editar Perfil</h2>
				<button class="btn-close" onclick={closeModal} type="button" aria-label="Cerrar modal">&times;</button>
			</header>

			<form onsubmit={handleUpdateProfile} class="modal-form">
				{#if errorMessage}
					<p class="error-msg">{errorMessage}</p>
				{/if}

				<div class="form-group">
					<label for="nombre">Nombre de usuario</label>
					<input
						type="text"
						id="nombre"
						bind:value={newNombre}
						placeholder="Ingresa tu nombre"
						required
					/>
				</div>

				<div class="form-group">
					<label for="email">Correo electrónico</label>
					<input
						type="email"
						id="email"
						value={profile.email}
						disabled
						class="input-disabled"
					/>
				</div>

				<footer class="modal-actions">
					<button type="button" class="btn-cancel" onclick={closeModal}>Cancelar</button>
					<button type="submit" class="btn-save" disabled={isLoading}>
						{isLoading ? 'Guardando...' : 'Guardar Cambios'}
					</button>
				</footer>
			</form>
		</div>
	</div>
{/if}   

<style>
	/* Estilos generales del contenedor principal */
	.profile-container {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		max-width: 1140px;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #1e293b;
		background-color: #f8fafc;
	}

	.card {
		background: #ffffff;
		border: 1px solid #f1f5f9;
		border-radius: 20px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.profile-card {
		padding: 2.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.avatar-wrapper {
		width: 110px;
		height: 110px;
		border-radius: 50%;
		overflow: hidden;
		background-color: #e2e8f0;
		margin-bottom: 1.2rem;
	}

	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-name {
		font-size: 1.4rem;
		font-weight: 700;
		color: #143d23;
		margin: 0 0 1.2rem 0;
	}

	.btn-edit {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1.2rem;
		border: 1.5px solid #39A900;
		border-radius: 25px;
		background: transparent;
		color: #39A900;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-edit:hover {
		background-color: #f0fdf4;
	}

	.settings-card {
		padding: 1.8rem 1.5rem;
	}

	.settings-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: #64748b;
		margin: 0 0 1.2rem 0;
	}

	.settings-menu {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		text-decoration: none;
		color: #39A900;
		font-weight: 600;
		font-size: 0.95rem;
		transition: color 0.2s;
	}

	.menu-item:hover {
		color: #166534;
	}

	.chevron {
		color: #94a3b8;
	}

	.main-content {
		padding: 2.5rem;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #f1f5f9;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #143d23;
		margin: 0 0 0.3rem 0;
	}

	.section-subtitle {
		font-size: 0.975rem;
		color: #64748b;
		margin: 0;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.8rem;
		background-color: #dcfeeb;
		color: #16a34a;
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 20px;
	}

	.dot {
		width: 7px;
		height: 7px;
		background-color: #16a34a;
		border-radius: 50%;
	}

	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		padding: 1.1rem 0;
		border-bottom: 1px solid #f8fafc;
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.icon-box {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.activity-details {
		flex: 1;
	}

	.activity-text {
		margin: 0;
		font-size: 0.95rem;
		color: #334155;
	}

	.activity-text strong {
		color: #143d23;
	}

	.activity-time {
		font-size: 0.8rem;
		color: #94a3b8;
	}

	.category-tag {
		padding: 0.25rem 0.75rem;
		background-color: #f1f5f9;
		color: #64748b;
		font-size: 0.75rem;
		font-weight: 500;
		border-radius: 12px;
	}

	/* --- Estilos del Modal --- */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(15, 23, 42, 0.4);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-card {
		background: #ffffff;
		border-radius: 20px;
		width: 100%;
		max-width: 450px;
		padding: 2rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: #143d23;
		margin: 0;
	}

	.btn-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #64748b;
		cursor: pointer;
		line-height: 1;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #475569;
	}

	.form-group input {
		padding: 0.65rem 0.875rem;
		border: 1.5px solid #cbd5e1;
		border-radius: 10px;
		font-size: 0.95rem;
		outline: none;
		transition: border-color 0.2s;
	}

	.form-group input:focus {
		border-color: #16a34a;
	}

	.input-disabled {
		background-color: #f1f5f9;
		color: #94a3b8;
		cursor: not-allowed;
	}

	.error-msg {
		color: #dc2626;
		font-size: 0.85rem;
		margin: 0;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.8rem;
		margin-top: 1rem;
	}

	.btn-cancel {
		padding: 0.55rem 1.2rem;
		border: 1px solid #cbd5e1;
		background: transparent;
		border-radius: 20px;
		color: #64748b;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.btn-save {
		padding: 0.55rem 1.3rem;
		border: none;
		background-color: #39A900;
		border-radius: 20px;
		color: #ffffff;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-save:hover {
		background-color: #42c500;
	}

	.btn-save:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.profile-container {
			grid-template-columns: 1fr;
			margin: 1rem auto;
		}

		.main-content {
			padding: 1.5rem;
		}

		.content-header {
			flex-direction: column;
			gap: 1rem;
		}

		.modal-card {
			margin: 1rem;
		}
	}
</style>