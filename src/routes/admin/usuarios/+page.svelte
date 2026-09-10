<script>
    import { enhance } from '$app/forms';
    import { supabase } from '$lib/supabaseClient';

    let { data, form } = $props();

    let busqueda = $state('');
    let usuarioEditando = $state({});

    let usuariosFiltrados = $derived(
        data.usuarios.filter((usuario) =>
            usuario.nombre
                ?.toLowerCase()
                .includes(busqueda.toLowerCase()) ||
            usuario.email
                ?.toLowerCase()
                .includes(busqueda.toLowerCase())
        )
    );

    function editarUsuario(usuario) {
        usuarioEditando = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };
    }

    function cancelarEdicion() {
        usuarioEditando = {};
    }

/**
 * Elimina un usuario de la base de datos y actualiza la lista local.
 * @param {string} idUsuario - El UUID del usuario a eliminar.
 */
async function eliminarUsuario(idUsuario) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');

    if (!confirmacion) return;

    try {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', idUsuario);

        if (error) {
            alert('Error al eliminar el usuario: ' + error.message);
            return;
        }

        data.usuarios = data.usuarios.filter(
            /** @param {{ id: string }} u */
            (u) => u.id !== idUsuario
        );

    } catch (err) {
        console.error('Error inesperado al eliminar:', err);
        alert('Ocurrió un error inesperado. Inténtalo de nuevo.');
    }
}
</script>

<svelte:head>
    <title>Usuarios | Administrador</title>
</svelte:head>

<h1>Gestión de usuarios</h1>

<div class="usuarios-page">

    <div class="page-header">

        <div>
            <h1>Gestionar Usuarios</h1>

            <p>
                Administra los usuarios registrados en Talking Hands.
            </p>
        </div>

    </div>


    <!-- =========================
            BARRA DE HERRAMIENTAS
    ========================= -->

    <div class="toolbar">

        <div class="search-container">

            <svg
                class="search-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="11"
                    cy="11"
                    r="7"
                />

                <path
                    d="m20 20-4-4"
                />
            </svg>


            <input
                type="text"
                placeholder="Buscar usuario..."
                bind:value={busqueda}
                aria-label="Buscar usuario"
            />

        </div>


        <button
            type="button"
            class="add-button"
            onclick={agregarUsuario}
        >

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </svg>

            Agregar usuario

        </button>

    </div>
    {#if usuarioEditando}
    <div class="edit-container">
        <div class="edit-header">
            <div>
                <h2>Editar usuario</h2>
                <p>Modifica la información del usuario.</p>
            </div>

            <button
                type="button"
                class="close-button"
                aria-label="Cerrar"
                onclick={cancelarEdicion}
            >
                ×
            </button>
        </div>

        <form
            method="POST"
            action="?/editar"
            use:enhance
            class="edit-form"
        >
            <input
                type="hidden"
                name="id"
                value={usuarioEditando.id}
            />

            <div class="form-group">
                <label for="nombre">Nombre</label>

                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={usuarioEditando.nombre}
                    required
                />
            </div>

            <div class="form-group">
                <label for="email">Correo electrónico</label>

                <input
                    id="email"
                    type="email"
                    value={usuarioEditando.email}
                    disabled
                />
            </div>

            <div class="form-group">
                <label for="rol">Rol</label>

                <select
                    id="rol"
                    name="rol"
                    value={usuarioEditando.rol}
                    required
                >
                    <option value="aprendiz">Aprendiz</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div class="form-actions">
                <button
                    type="button"
                    class="cancel-button"
                    onclick={cancelarEdicion}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="save-button"
                >
                    Guardar cambios
                </button>
            </div>
        </form>
    </div>
    {/if}

    <!-- =========================
        LISTA DE USUARIOS
    ========================= -->

    <div class="users-container">

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>

                        <th>
                            Nombre
                        </th>

                        <th>
                            Correo electrónico
                        </th>

                        <th>
                            Rol
                        </th>

                        <th class="actions-header">
                            Acciones
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {#each usuariosFiltrados as usuario}

                        <tr>

                            <td class="name-cell">
                                {usuario.nombre}
                            </td>


                            <td class="email-cell">
                                {usuario.email}
                            </td>


                            <td>

                                <span
                                    class:admin-role={usuario.rol === 'Administrador'}
                                    class="role-badge"
                                >
                                    {usuario.rol}
                                </span>

                            </td>


                            <td>

                                <div class="actions">

                                    <!-- EDITAR -->

                                    <button
                                        type="button"
                                        class="action-button edit"
                                        aria-label="Editar usuario"
                                        title="Editar"
                                        onclick={() => editarUsuario(usuario)}
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 20h9" />

                                            <path
                                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                                            />
                                        </svg>

                                    </button>


                                    <!-- ELIMINAR -->

                                    <button
                                        type="button"
                                        class="action-button delete"
                                        aria-label="Eliminar usuario"
                                        title="Eliminar"
                                        onclick={() => eliminarUsuario(usuario.id)}
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />

                                            <path
                                                d="M8 6V4h8v2"
                                            />

                                            <path
                                                d="M19 6l-1 14H6L5 6"
                                            />

                                            <path d="M10 11v5" />

                                            <path d="M14 11v5" />
                                        </svg>

                                    </button>

                                </div>

                            </td>

                        </tr>

                    {:else}

                        <tr>

                            <td
                                colspan="4"
                                class="empty-state"
                            >
                                No se encontraron usuarios.
                            </td>

                        </tr>

                    {/each}

                </tbody>

            </table>

        </div>

    </div>

</div>


<style>


    .usuarios-page {
        max-width: 1200px;

        margin: 0 auto;
    }



    .page-header {
        position: relative;

        background: white;

        border: 1px solid #E2E8F0;

        border-radius: 12px;

        padding: 30px;

        margin-bottom: 20px;

        overflow: hidden;

        box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.03);
    }


    .page-header::before {
        content: '';

        position: absolute;

        top: 0;

        left: 0;

        width: 100%;

        height: 4px;

        background:
            linear-gradient(
                90deg,
                #39A900 0%,
                #FC7314 100%
            );
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



    .toolbar {
        background: white;

        border: 1px solid #E2E8F0;

        border-radius: 12px;

        padding: 16px;

        margin-bottom: 20px;

        display: flex;

        align-items: center;

        gap: 15px;

        box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.03);
    }



    .search-container {
        position: relative;

        flex: 1;

        max-width: 500px;
    }


    .search-container input {
        width: 100%;

        height: 42px;

        padding: 0 15px 0 42px;

        border: 1px solid #E2E8F0;

        border-radius: 8px;

        outline: none;

        color: #1E293B;

        background: #FFFFFF;

        font-family: inherit;

        font-size: 14px;

        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }


    .search-container input::placeholder {
        color: #94A3B8;
    }


    .search-container input:focus {
        border-color: #39A900;

        box-shadow:
            0 0 0 3px rgba(57, 169, 0, 0.10);
    }


    .search-icon {
        position: absolute;

        left: 14px;

        top: 50%;

        width: 17px;

        height: 17px;

        transform: translateY(-50%);

        fill: none;

        stroke: #94A3B8;

        stroke-width: 2;

        stroke-linecap: round;

        stroke-linejoin: round;

        pointer-events: none;
    }



    .add-button {
        height: 42px;

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        padding: 0 17px;

        border: none;

        border-radius: 8px;

        background: #39A900;

        color: white;

        font-family: inherit;

        font-size: 14px;

        font-weight: 600;

        cursor: pointer;

        white-space: nowrap;

        box-shadow:
            0 4px 12px rgba(57, 169, 0, 0.18);

        transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }


    .add-button svg {
        width: 17px;

        height: 17px;

        fill: none;

        stroke: currentColor;

        stroke-width: 2;

        stroke-linecap: round;
    }


    .add-button:hover {
        background: #2F8F00;

        transform: translateY(-1px);

        box-shadow:
            0 6px 15px rgba(57, 169, 0, 0.22);
    }



    .users-container {
        background: white;

        border: 1px solid #E2E8F0;

        border-radius: 12px;

        overflow: hidden;

        box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.03);
    }


    .table-wrapper {
        width: 100%;

        overflow-x: auto;
    }



    table {
        width: 100%;

        border-collapse: collapse;

        min-width: 700px;
    }


    thead {
        background: #F8FAFC;
    }


    th {
        padding: 15px 20px;

        text-align: left;

        color: #475569;

        font-size: 13px;

        font-weight: 600;

        border-bottom:
            1px solid #E2E8F0;

        white-space: nowrap;
    }


    td {
        padding: 16px 20px;

        color: #64748B;

        font-size: 14px;

        border-bottom:
            1px solid #F1F5F9;
    }


    tbody tr:last-child td {
        border-bottom: none;
    }


    tbody tr {
        transition:
            background 0.2s ease;
    }


    tbody tr:hover {
        background: #FAFCFA;
    }



    .name-cell {
        color: #1E293B;

        font-weight: 600;
    }


    .email-cell {
        color: #64748B;
    }



    .role-badge {
        display: inline-flex;

        align-items: center;

        padding: 5px 10px;

        border-radius: 20px;

        background: #F0FDF4;

        border: 1px solid rgba(57, 169, 0, 0.20);

        color: #39A900;

        font-size: 12px;

        font-weight: 600;
    }


    .role-badge.admin-role {
        background: #FFF7ED;

        border-color:
            rgba(252, 115, 20, 0.25);

        color: #FC7314;
    }



    .actions-header {
        text-align: center;
    }


    .actions {
        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;
    }


    .action-button {
        width: 35px;

        height: 35px;

        display: flex;

        align-items: center;

        justify-content: center;

        border: 1px solid #E2E8F0;

        border-radius: 8px;

        background: white;

        cursor: pointer;

        transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
    }


    .action-button svg {
        width: 17px;

        height: 17px;

        fill: none;

        stroke: currentColor;

        stroke-width: 2;

        stroke-linecap: round;

        stroke-linejoin: round;
    }



    .action-button.edit {
        color: #39A900;
    }


    .action-button.edit:hover {
        background: #F0FDF4;

        border-color:
            rgba(57, 169, 0, 0.3);

        transform: translateY(-1px);
    }



    .action-button.delete {
        color: #FC7314;
    }


    .action-button.delete:hover {
        background: #FFF7ED;

        border-color:
            rgba(252, 115, 20, 0.3);

        transform: translateY(-1px);
    }




    .empty-state {
        padding: 40px 20px;

        text-align: center;

        color: #94A3B8;

        font-size: 14px;
    }



    @media (max-width: 650px) {

        .page-header {
            padding: 25px 20px;
        }


        .page-header h1 {
            font-size: 24px;
        }


        .toolbar {
            flex-direction: column;

            align-items: stretch;
        }


        .search-container {
            max-width: none;
        }


        .add-button {
            width: 100%;
        }

    }
    .edit-container {
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }

    .edit-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 25px;
    }

    .edit-header h2 {
        margin: 0 0 6px;
        color: #1E293B;
        font-size: 20px;
    }

    .edit-header p {
        margin: 0;
        color: #64748B;
        font-size: 14px;
    }

    .close-button {
        border: none;
        background: transparent;
        color: #64748B;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
    }

    .close-button:hover {
        color: #1E293B;
    }

    .edit-form {
        display: grid;
        gap: 18px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    .form-group label {
        color: #1E293B;
        font-size: 14px;
        font-weight: 600;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        box-sizing: border-box;
        padding: 11px 13px;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        background: white;
        color: #1E293B;
        font-size: 14px;
        outline: none;
    }

    .form-group input:focus,
    .form-group select:focus {
        border-color: #39A900;
        box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.08);
    }

    .form-group input:disabled {
        background: #F1F5F9;
        color: #64748B;
        cursor: not-allowed;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 5px;
    }

    .cancel-button,
    .save-button {
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }

    .cancel-button {
        background: #F1F5F9;
        color: #475569;
    }

    .cancel-button:hover {
        background: #E2E8F0;
    }

    .save-button {
        background: #39A900;
        color: white;
    }

    .save-button:hover {
        background: #2f8f00;
    }

</style>