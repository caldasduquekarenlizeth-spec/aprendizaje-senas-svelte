<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';

    /** @type {import('@supabase/supabase-js').User | null} */
    let usuario = $state(null);
    let cargando = $state(true);

    // Datos estáticos para renderizar los 3 módulos
    const listaModulos = [
        {
            id: 1,
            titulo: 'Módulo 1',
            subtitulo: 'Introducción a la Lengua de Señas',
            descripcion: 'Aprende las bases fundamentales, el abecedario dactilológico y la cultura sorda.',
            imagen: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=600&q=80',
            badge: 'Fundamentos'
        },
        {
            id: 2,
            titulo: 'Módulo 2',
            subtitulo: 'Comunicación Básica',
            descripcion: 'Estructuras sencillas, saludos, expresiones cotidianas y vocabulario inicial.',
            imagen: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
            badge: 'Interacción'
        },
        {
            id: 3,
            titulo: 'Módulo 3',
            subtitulo: 'Vocabulario Avanzado',
            descripcion: 'Expande tu léxico con señas temáticas: contexto social, laboral y profesional.',
            imagen: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
            badge: 'Práctica'
        }
    ];

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
    });

    async function cerrarSesion() {
        await supabase.auth.signOut();
        goto('/login');
    }
</script>

<svelte:head>
    <title>Módulos | Talking Hands</title>
    <meta
        name="description"
        content="Módulos de aprendizaje de lengua de señas"
    />
</svelte:head>

{#if cargando}

    <div class="cargando">
        <p>Verificando sesión...</p>
    </div>

{:else}

    <main class="contenedor">

        <header class="encabezado">

            <div class="titulo-modulos">
                <img src="/logo_th.png" alt="Logo del proyecto" class="logo" />

                <div class="informacion-usuario">
                    <h1>Módulos de aprendizaje</h1>
                    <p>Bienvenido, {usuario?.email}</p>
                </div>
            </div>

            <button class="btn-cerrar" onclick={cerrarSesion}>
                Cerrar sesión
            </button>

        </header>

        <section class="modulos-grid">

            {#each listaModulos as modulo}
                <article class="modulo-card">
                    <div class="banner-container">
                        <img src={modulo.imagen} alt={modulo.titulo} class="modulo-img" />
                        <span class="badge">{modulo.badge}</span>
                    </div>

                    <div class="modulo-body">
                        <h2>{modulo.titulo}</h2>
                        <h3>{modulo.subtitulo}</h3>
                        <p>{modulo.descripcion}</p>

                        <button class="btn-modulo">
                            Ver módulo
                        </button>
                    </div>
                </article>
            {/each}

        </section>

    </main>

{/if}

<style>
    :global(*) {
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    :global(body) {
        margin: 0;
        background: #F4F6F8;
        color: #1E293B;
    }

    .cargando {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #64748B;
        font-weight: 500;
        font-size: 16px;
    }

    .contenedor {
        max-width: 1150px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    /* ENCABEZADO */
    .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 35px;
        gap: 20px;
    }

    .titulo-modulos {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .logo {
        width: 75px;
        height: 75px;
        object-fit: contain;
    }

    .informacion-usuario h1 {
        margin: 0 0 4px 0;
        font-size: 28px;
        font-weight: 700;
        color: #1E293B;
    }

    .informacion-usuario p {
        margin: 0;
        color: #64748B;
        font-size: 14px;
    }

    .btn-cerrar {
        padding: 10px 20px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        background: #FFFFFF;
        color: #FC7314;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-cerrar:hover {
        background: #FFF7ED;
        border-color: #FC7314;
    }

    /* GRID DE MÓDULOS */
    .modulos-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
    }

    .modulo-card {
        position: relative;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }

    /* Borde superior en gradiente */
    .modulo-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #39A900 0%, #FC7314 100%);
        z-index: 2;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }

    .modulo-card:hover {
        transform: translateY(-6px);
        border-color: rgba(57, 169, 0, 0.3);
        box-shadow: 0 12px 24px -6px rgba(57, 169, 0, 0.15);
    }

    /* BANNER E IMAGEN */
    .banner-container {
        position: relative;
        width: 100%;
        height: 160px;
        background: #E2E8F0;
        overflow: hidden;
    }

    .modulo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.35s ease;
    }

    .modulo-card:hover .modulo-img {
        transform: scale(1.05);
    }

    .badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(30, 41, 59, 0.85);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
        backdrop-filter: blur(4px);
    }

    /* CUERPO DEL MÓDULO */
    .modulo-body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .modulo-body h2 {
        margin: 0 0 4px 0;
        color: #39A900;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .modulo-body h3 {
        margin: 0 0 8px 0;
        color: #1E293B;
        font-size: 18px;
        font-weight: 600;
    }

    .modulo-body p {
        color: #64748B;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 20px 0;
        flex-grow: 1;
    }

    .btn-modulo {
        width: 100%;
        padding: 11px 15px;
        border: none;
        border-radius: 8px;
        background: #39A900;
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }

    .modulo-card:hover .btn-modulo {
        background: #319200;
        box-shadow: 0 4px 12px rgba(57, 169, 0, 0.25);
    }

    /* RESPONSIVE */
    @media (max-width: 900px) {
        .modulos-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 600px) {
        .modulos-grid {
            grid-template-columns: 1fr;
        }

        .encabezado {
            flex-direction: column;
            align-items: flex-start;
        }

        .btn-cerrar {
            width: 100%;
        }
    }
</style>