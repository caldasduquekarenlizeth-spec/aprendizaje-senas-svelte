<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase';

    let usuario = $state(null);
    let cargando = $state(true);

    // Lista de líderes ficticia (puedes reemplazarla luego por una consulta a Supabase)
    let ranking = $state([
        { posicion: 1, nombre: 'María', puntos: 1450, avatar: 'https://i.pravatar.cc/150?img=47' },
        { posicion: 2, nombre: 'Pablo', puntos: 1450, avatar: 'https://i.pravatar.cc/150?img=12' },
        { posicion: 3, nombre: 'Juan', puntos: 1100, avatar: 'https://i.pravatar.cc/150?img=60' },
        { posicion: 4, nombre: 'Alex', puntos: 1000, avatar: 'https://i.pravatar.cc/150?img=33' },
        { posicion: 5, nombre: 'Paula', puntos: 950, avatar: 'https://i.pravatar.cc/150?img=9' },
        { posicion: 6, nombre: 'Angela', puntos: 860, avatar: 'https://i.pravatar.cc/150?img=5' }
    ]);

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

    function getMedalEmoji(posicion) {
        if (posicion === 1) return '🥇';
        if (posicion === 2) return '🥈';
        if (posicion === 3) return '🥉';
        return `${posicion}°`;
    }
</script>

<svelte:head>
    <title>Ranking | Talking Hands</title>
</svelte:head>

{#if cargando}
    <div class="cargando">
        <p>Cargando tabla de posiciones...</p>
    </div>
{:else}
    <main class="contenedor">
        <header class="encabezado-ranking">
            <div>
                <h1>Ranking 🏆</h1>
                <p>Aprendices con el mayor puntaje en la app</p>
            </div>
        </header>

        <section class="lista-ranking">
            {#each ranking as jugador}
                <article class="tarjeta-posicion" class:top-tres={jugador.posicion <= 3}>
                    <div class="posicion-wrapper">
                        <span class="posicion" class:oro={jugador.posicion === 1} class:plata={jugador.posicion === 2} class:bronce={jugador.posicion === 3}>
                            {getMedalEmoji(jugador.posicion)}
                        </span>
                    </div>

                    <img src={jugador.avatar} alt={jugador.nombre} class="avatar" />

                    <div class="info-jugador">
                        <span class="nombre">{jugador.nombre}</span>
                        <span class="puntos">{jugador.puntos} XP</span>
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
        font-size: 16px;
    }

    .contenedor {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .encabezado-ranking {
        margin-bottom: 30px;
    }

    .encabezado-ranking h1 {
        margin: 0 0 6px 0;
        font-size: 32px;
        font-weight: 700;
        color: #39A900; /* Verde SENA */
    }

    .encabezado-ranking p {
        margin: 0;
        color: #64748B;
        font-size: 15px;
    }

    .lista-ranking {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .tarjeta-posicion {
        position: relative;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 14px;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        overflow: hidden;
    }

    .tarjeta-posicion:hover {
        transform: translateX(6px);
        border-color: rgba(57, 169, 0, 0.3);
        box-shadow: 0 8px 20px rgba(57, 169, 0, 0.1);
    }

    /* Detalle sutil para las tarjetas de Top 3 */
    .top-tres::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #39A900 0%, #FC7314 100%);
    }

    .posicion-wrapper {
        min-width: 45px;
        text-align: center;
    }

    .posicion {
        font-size: 20px;
        font-weight: 700;
        color: #64748B;
    }

    .posicion.oro {
        font-size: 24px;
    }

    .posicion.plata {
        font-size: 24px;
    }

    .posicion.bronce {
        font-size: 24px;
    }

    .avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #E2E8F0;
        background: #F1F5F9;
    }

    .info-jugador {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .nombre {
        font-size: 18px;
        font-weight: 700;
        color: #1E293B;
    }

    .nombre::after {
        content: ':';
        margin-right: 4px;
    }

    .puntos {
        font-size: 18px;
        font-weight: 800;
        color: #39A900; /* Verde SENA para el puntaje */
    }

    @media (max-width: 600px) {
        .contenedor {
            padding: 20px 15px;
        }

        .tarjeta-posicion {
            padding: 12px 16px;
            gap: 14px;
        }

        .avatar {
            width: 44px;
            height: 44px;
        }

        .nombre, .puntos {
            font-size: 16px;
        }
    }
</style>