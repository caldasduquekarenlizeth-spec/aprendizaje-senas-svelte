<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';

    /** @type {import('@supabase/supabase-js').User | null} */
    let usuario = $state(null);
    /** @type {{ nombre: string } | null} */
    let perfil = $state(null)
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

        const { data: datosPerfil, error } = await supabase
            .from('profiles')
            .select('nombre')
            .eq('id', session.user.id)
            .single();

        if (!error && datosPerfil) {
            perfil = datosPerfil;
        }

        cargando = false;
    });

    async function cerrarSesion() {
        await supabase.auth.signOut();

        goto('/login');
    }
</script>

<svelte:head>
    <title>Módulos</title>
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

                    <p>
                        Bienvenido, {perfil?.nombre || usuario?.email}
                    </p>
                </div>
            </div>

            <button onclick={cerrarSesion}>
                Cerrar sesión
            </button>

        </header>

        <section class="modulos">

            <article class="modulo">
                <h2>Módulo 1</h2>

                <p>
                    Introducción a la lengua de señas.
                </p>

                <button>
                    Ver módulo
                </button>
            </article>

            <article class="modulo">
                <h2>Módulo 2</h2>

                <p>
                    Comunicación básica.
                </p>

                <button>
                    Ver módulo
                </button>
            </article>

            <article class="modulo">
                <h2>Módulo 3</h2>

                <p>
                    Vocabulario.
                </p>

                <button>
                    Ver módulo
                </button>
            </article>

        </section>

    </main>

{/if}

<style>
    .titulo-modulos {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 35px;
    }
    
    .logo {
        width: 85px;
        height: 85px;
        object-fit: contain;
    }
    
    .informacion-usuario h1 {
        margin: 0 0 8px 0;
        font-size: 34px;
        font-weight: 700;
        color: #1E293B;
    }
    
    .informacion-usuario p {
        margin: 0;
        color: #64748B;
        font-size: 15px;
    }

    .titulo-modulos h1 {
    	margin: 0;
    	font-size: 34px;
    	font-weight: 700;
    }
    * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: #F4F6F8; /* Fondo Gris Calmo */
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
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        gap: 20px;
    }

    h1 {
        margin: 0 0 8px 0;
        color: #1E293B; /* Gris Carbón */
        font-size: 28px;
        font-weight: 700;
    }

    .encabezado p {
        margin: 0;
        color: #64748B; /* Gris Muted */
        font-size: 15px;
    }

    /* Botón de Salir / Acción Principal del Encabezado */
    .encabezado button {
        padding: 10px 20px;
        border: 1px solid #CBD5E1;
        border-radius: 6px;
        background: #FFFFFF;
        color: #FC7314; /* Naranja Cálido para cerrar sesión/acciones secundarias */
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
    }

    .encabezado button:hover {
        background: #FFF7ED; /* Fondo sutil naranja al pasar el mouse */
        border-color: #FC7314;
    }

    .modulo {
        padding: 25px;
        border-radius: 12px;
        background: #FFFFFF; /* Blanco Puro */
        border: 1px solid #E2E8F0; /* Borde sutil */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); /* Sombra tenue */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .modulo:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
        border-color: #CBD5E1;
    }

    .modulo h2 {
        margin-top: 0;
        margin-bottom: 12px;
        color: #1E293B; /* Gris Carbón */
        font-size: 18px;
        font-weight: 600;
    }

    .modulo p {
        color: #64748B; /* Gris Muted */
        font-size: 14px;
        line-height: 1.5;
        min-height: 45px;
        margin-bottom: 20px;
    }

    /* Botón del Módulo */
    .modulo button {
        width: 100%;
        padding: 11px 15px;
        border: none;
        border-radius: 6px;
        background: #39A900; /* Verde SENA */
        color: #FFFFFF;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .modulo button:hover {
        background: #319200; /* Verde SENA interacción */
    }

    @media (max-width: 768px) {
        .modulo {
            grid-template-columns: 1fr;
        }

        .encabezado {
            flex-direction: column;
            align-items: flex-start;
        }

        .encabezado button {
            width: 100%;
        }
    }
    /* Estilos para tarjetas de módulos interactivos */
    .modulo {
        position: relative;
        padding: 25px;
        border-radius: 14px;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Línea superior difuminada en degradado Verde SENA -> Naranja */
    .modulo::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #39A900 0%, #FC7314 100%);
        opacity: 0.3;
        transition: opacity 0.35s ease, height 0.35s ease;
    }
    
    /* Resplandor ambiental difuminado en la esquina inferior derecha */
    .modulo::after {
        content: '';
        position: absolute;
        bottom: -40px;
        right: -40px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(57, 169, 0, 0.15) 0%, rgba(252, 115, 20, 0.05) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease, transform 0.35s ease;
    }
    
    /* Estado Hover Interactivo */
    .modulo:hover {
        transform: translateY(-6px);
        border-color: rgba(57, 169, 0, 0.3);
        /* Sombra difuminada suave que combina los dos colores */
        box-shadow: 
            0 12px 24px -6px rgba(57, 169, 0, 0.15),
            0 8px 16px -4px rgba(252, 115, 20, 0.1);
    }
    
    .modulo:hover::before {
        opacity: 1;
        height: 5px;
    }
    
    .modulo:hover::after {
        opacity: 1;
        transform: scale(1.3);
    }
    
    /* Animación sutil para el botón dentro del módulo al hacer hover en la tarjeta */
    .modulo:hover button {
        background: linear-gradient(135deg, #39A900 0%, #319200 100%);
        box-shadow: 0 4px 12px rgba(57, 169, 0, 0.25);
    }
    </style>