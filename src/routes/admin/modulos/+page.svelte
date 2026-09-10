<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';

    let modulos = $state([]);
    let cargando = $state(true);
    let errorMsg = $state('');
    let exitoMsg = $state('');

    let modoEdicion = $state(false);
    let moduloSeleccionadoId = $state(null);
    let nombre = $state('');
    let descripcion = $state('');

    function mostrarExito(mensaje) {
        exitoMsg = mensaje;
        setTimeout(() => {
            exitoMsg = '';
        }, 3000);
    }

    // 1. OBTENER MÓDULOS DE SUPABASE
    async function cargarModulos() {
        cargando = true;
        errorMsg = '';

        const { data, error } = await supabase
            .from('modulos')
            .select('*');

        if (error) {
            console.error('Error al cargar módulos:', error.message);
            errorMsg = 'No se pudieron cargar los módulos.';
        } else {
            modulos = data.map((m) => ({
                id: m.id,
                nombre: m.nombre,
                descripcion: m.descripcion
            }));
        }

        cargando = false;
    }

    // 2. ELIMINAR MÓDULO
    async function eliminarModulo(id) {
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este módulo?');
        if (!confirmar) return;

        const { error } = await supabase
            .from('modulos')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            modulos = modulos.filter((m) => m.id !== id);
        }
    }

    // 3. PREPARAR EDICIÓN
    function editarModulo(id) {
        const modulo = modulos.find((m) => m.id === id);
        if (!modulo) return;

        moduloSeleccionadoId = id;
        nombre = modulo.nombre;
        descripcion = modulo.descripcion;
        modoEdicion = true;
    }

    // 4. GUARDAR CAMBIOS (CREAR O EDITAR)
    async function guardarModulo(e) {
        e.preventDefault();

        if (modoEdicion) {
            // Actualizar registro existente
            const { error } = await supabase
                .from('modulos')
                .update({ nombre, descripcion })
                .eq('id', moduloSeleccionadoId);

            if (error) {
                alert('Error al actualizar: ' + error.message);
            } else {
                await cargarModulos();
                limpiarFormulario();
                mostrarExito('Módulo actualizado con éxito')
            }
        } else {
            // Crear nuevo registro
            const { error } = await supabase
                .from('modulos')
                .insert([{ nombre, descripcion }]);

            if (error) {
                alert('Error al crear: ' + error.message);
            } else {
                await cargarModulos();
                limpiarFormulario();
                mostrarExito('Módulo creado con éxito')
            }
        }
    }

    function limpiarFormulario() {
        modoEdicion = false;
        moduloSeleccionadoId = null;
        nombre = '';
        descripcion = '';
    }

    // Cargar los módulos al montar el componente
    onMount(() => {
        cargarModulos();
    });
</script>

<svelte:head>
    <title>Módulos | Administrador</title>
</svelte:head>

<h1>Gestión de módulos</h1>

<div class="modulos-page">

    <!-- =========================
        ENCABEZADO
    ========================= -->

    <div class="page-header">
        
        <!-- FORMULARIO DE CREACIÓN / EDICIÓN -->
        <form onsubmit={guardarModulo} class="module-form">
            <h3>{modoEdicion ? 'Editar Módulo' : 'Nuevo Módulo'}</h3>
            
            <div class="form-group">
                <label for="nombre">Nombre del módulo</label>
                <input 
                    type="text" 
                    id="nombre" 
                    bind:value={nombre} 
                    placeholder="Ej: Abecedario en LSC" 
                    required 
                />
            </div>

            <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea 
                    id="descripcion" 
                    bind:value={descripcion} 
                    placeholder="Escribe una breve descripción..." 
                    rows="3"
                    required
                ></textarea>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">
                    {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>

                {#if modoEdicion}
                    <button type="button" class="btn-secondary" onclick={limpiarFormulario}>
                        Cancelar
                    </button>
                {/if}
            </div>
        </form>

        <div>
            <h1>Gestionar Módulos</h1>

            <p>
                Administra los módulos de aprendizaje de Talking Hands.
            </p>
        </div>

    </div>


    <!-- =========================
        LISTA DE MÓDULOS
    ========================= -->

    <div class="modules-container">

        {#if exitoMsg}
        <div class="alert-success">
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{exitoMsg}</span>
        </div>
        {/if}

        {#if cargando}
            <p class="loading-text">Cargando módulos...</p>

        {:else if errorMsg}
            <p class="error-text">{errorMsg}</p>

        {:else if modulos.length === 0}
            <p class="empty-text">No hay módulos registrados aún.</p>

        {:else}
            {#each modulos as modulo, i (modulo.id)}

            <div class="module-card">

                <div class="module-number">
                    {i + 1}
                </div>

                <div class="module-info">

                    <h2>
                        Modulo {i + 1}: {modulo.nombre}
                    </h2>

                    <p>
                        {modulo.descripcion}
                    </p>

                </div>


                <!-- ACCIONES -->

                <div class="module-actions">

                    <!-- EDITAR -->

                    <button
                        type="button"
                        class="action-button edit"
                        aria-label="Editar módulo"
                        title="Editar"
                        onclick={() => editarModulo(modulo.id)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 20h9"
                            />

                            <path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                            />
                        </svg>
                    </button>


                    <!-- ELIMINAR -->

                    <button
                        type="button"
                        class="action-button delete"
                        aria-label="Eliminar módulo"
                        title="Eliminar"
                        onclick={() => eliminarModulo(modulo.id)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M3 6h18"
                            />

                            <path
                                d="M8 6V4h8v2"
                            />

                            <path
                                d="M19 6l-1 14H6L5 6"
                            />

                            <path
                                d="M10 11v5"
                            />

                            <path
                                d="M14 11v5"
                            />
                        </svg>
                    </button>

                </div>

            </div>
            {/each}
        {/if}

    </div>

</div>


<style>
    .modulos-page {
        max-width: 1200px;
        margin: 0 auto;
    }

    .alert-success {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #DCFCE7;
        color: #15803D;
        border: 1px solid #BBF7D0;
        padding: 12px 16px;
        border-radius: 12px;
        font-weight: 500;
    }

    .alert-success svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .loading-text, .error-text, .empty-text {
    text-align: center;
    color: #64748B;
    font-size: 15px;
    padding: 20px 0;
    }

    .error-text {
        color: #EF4444;
    }

    /* =========================
        ENCABEZADO
    ========================= */
    .page-header {
        position: relative;
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 25px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }

    .page-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #39A900 0%, #FC7314 100%);
    }

    .page-header h1 {
        margin: 0 0 8px;
        color: #1E293B;
        font-size: 28px;
        font-weight: 700;
    }

    .page-header p {
        margin: 0;
        color: #64748B;
        font-size: 15px;
    }

    /* =========================
        FORMULARIO (CREAR/EDITAR)
    ========================= */
    .module-form {
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }

    .module-form h3 {
        margin: 0 0 20px;
        color: #1E293B;
        font-size: 20px;
        font-weight: 600;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 18px;
    }

    .form-group label {
        color: #1E293B;
        font-size: 14px;
        font-weight: 600;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        font-size: 14px;
        color: #1E293B;
        background-color: #FAFAFA;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    }

    .form-group textarea{
        resize: none;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        background-color: #FFFFFF;
        border-color: #39A900;
        box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.15);
    }

    .form-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
    }

    .btn-primary {
        background-color: #39A900;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .btn-primary:hover {
        background-color: #2e8800;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background-color: #F1F5F9;
        color: #64748B;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    .btn-secondary:hover {
        background-color: #E2E8F0;
        color: #1E293B;
    }

    /* =========================
        LISTA DE MÓDULOS
    ========================= */
    .modules-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
    }

    .module-card {
        display: flex;
        align-items: center;
        background-color: #FFFFFF;
        border: 1.5px solid #E2E8F0;
        border-radius: 20px;
        padding: 18px 24px;
        gap: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .module-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-color: rgba(57, 169, 0, 0.25);
    }

    .module-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 48px;
        background-color: #F2F9ED;
        color: #1B4D2E;
        font-size: 20px;
        font-weight: 700;
        border-radius: 10px;
        flex-shrink: 0;
    }   

    .module-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .module-info h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 700;
        color: #1B4D2E;
    }

    .module-card:hover .module-info h2 {
        color: #39A900;
    }

    .module-info p {
        margin: 0;
        font-size: 14px;
        color: #64748B;
        line-height: 1.4;
    }

    /* ACCIONES DE TARJETA */
    .module-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    .action-button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .action-button:active {
        transform: scale(0.97);
}

    .action-button svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .action-button.edit {
        background-color: #EEF2FF;
        color: #4F46E5;
    }

    .action-button.edit:hover {
        background-color: #E0E7FF;
    }

    .action-button.delete {
    background-color: #FEE2E2;
    color: #FC7314;
}

    .action-button.delete:hover {
        background: #FFF7ED;
        border-color: rgba(252, 115, 20, 0.3);
        transform: translateY(-1px);
    }

    /* ESTADOS (Carga, Vacío, Error) */
    .loading-text,
    .empty-text,
    .error-text {
        text-align: center;
        padding: 40px 20px;
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        color: #64748B;
        font-size: 15px;
    }

    .error-text {
        color: #FC7314;
        border-color: rgba(252, 115, 20, 0.3);
        background: #FFF7ED;
    }

    /* RESPONSIVO */
    @media (max-width: 600px) {
        .page-header {
            padding: 25px 20px;
        }

        .page-header h1 {
            font-size: 24px;
        }

        .module-form {
            padding: 20px;
        }

        .module-card {
            padding: 20px;
            align-items: flex-start;
        }

        .module-info h2 {
            font-size: 16px;
        }

        .module-actions {
            gap: 5px;
        }

        .action-button {
            width: 35px;
            height: 35px;
        }
    }
</style>
