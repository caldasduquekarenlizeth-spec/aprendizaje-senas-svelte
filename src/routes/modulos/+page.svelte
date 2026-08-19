<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';

    /** @type {import('@supabase/supabase-js').User | null} */
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

            <div>
                <h1>Módulos de aprendizaje</h1>

                <p>
                    Bienvenido
                    {usuario?.email}
                </p>
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
    .cargando {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
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
        margin-bottom: 8px;
    }

    .encabezado p {
        color: #666;
    }

    .encabezado button {
        padding: 10px 18px;
        border: none;
        border-radius: 6px;
        background: #222;
        color: white;
        cursor: pointer;
    }

    .modulos {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
    }

    .modulo {
        padding: 25px;
        border-radius: 10px;
        background: white;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    }

    .modulo h2 {
        margin-top: 0;
    }

    .modulo p {
        color: #666;
        min-height: 45px;
    }

    .modulo button {
        padding: 10px 15px;
        border: none;
        border-radius: 6px;
        background: #333;
        color: white;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .modulos {
            grid-template-columns: 1fr;
        }

        .encabezado {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>