<svelte:head>
    <title>Módulos | Administrador</title>
</svelte:head>

<h1>Gestión de módulos</h1>

<div class="modulos-page">

    <!-- =========================
        ENCABEZADO
    ========================= -->

    <div class="page-header">

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

        {#each modulos as modulo}

            <div class="module-card">

                <div class="module-info">

                    <h2>
                        {modulo.titulo}
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

    </div>

</div>


<style>

    .modulos-page {
        max-width: 1200px;
        margin: 0 auto;
    }


    .page-header {
        position: relative;

        background: white;

        border: 1px solid #E2E8F0;

        border-radius: 12px;

        padding: 30px;

        margin-bottom: 25px;

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



    .modules-container {
        display: flex;

        flex-direction: column;

        gap: 15px;
    }



    .module-card {
        background: white;

        border: 1px solid #E2E8F0;

        border-radius: 12px;

        padding: 22px 25px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 25px;

        transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
    }


    .module-card:hover {
        transform: translateY(-2px);

        box-shadow:
            0 8px 20px rgba(57, 169, 0, 0.08);

        border-color:
            rgba(57, 169, 0, 0.25);
    }



    .module-info {
        min-width: 0;
    }


    .module-info h2 {
        margin: 0 0 7px;

        color: #1E293B;

        font-size: 18px;

        font-weight: 600;

        transition: color 0.2s ease;
    }


    .module-card:hover .module-info h2 {
        color: #39A900;
    }


    .module-info p {
        margin: 0;

        color: #64748B;

        font-size: 14px;

        line-height: 1.5;
    }



    .module-actions {
        display: flex;

        align-items: center;

        gap: 8px;

        flex-shrink: 0;
    }


    .action-button {
        width: 38px;

        height: 38px;

        display: flex;

        align-items: center;

        justify-content: center;

        border-radius: 8px;

        border: 1px solid #E2E8F0;

        background: white;

        cursor: pointer;

        transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
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



    @media (max-width: 600px) {

        .page-header {
            padding: 25px 20px;
        }


        .page-header h1 {
            font-size: 24px;
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
