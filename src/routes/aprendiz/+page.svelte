<script>
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';

    //Se reciben los datos cargados desde el servidor

    let { data } = $props();

    async function cerrarSesion() {
        await supabase.auth.signOut();
        goto('/login');
    }
</script>

<svelte:head>
    <title>Dashboard | Aprendiz</title>
    <meta
        name="description"
        content="Dashboard principal de aprendiz"
    />
</svelte:head>

<main class="contenedor">
    <!-- Header / Tarjeta de Bienvenida -->
    <header class="welcome-card">
        <div class="header-top">
            <img src="/logo_th.svg" alt="Logo de Talking Hands" class="logo" />
            <button onclick={cerrarSesion} class="btn-logout" title="Cerrar sesión">
                Cerrar sesión
            </button>
        </div>

        <div class="welcome-text">
            <h1>¡Bienvenid@, {data.perfil?.nombre || data.usuario?.email}! 🖐️✨</h1>
            <p>
                Estás en tu panel de aprendizaje. Desde aquí podrás acceder a las lecciones, 
                módulos de práctica y hacer seguimiento a tu progreso en la Lengua de Señas.
            </p>
        </div>
    </header>

    <!-- Grid de Módulos (Preparado para agregar más tarjetas a futuro) -->
    <section class="grid-modules">
        <article class="module-card">
            <div class="card-content">
                <div class="card-icon">📚</div>
                <h2>Módulos de Aprendizaje</h2>
                <p>Explora los niveles, lecciones interactivas y vocabulario en Lengua de Señas.</p>
            </div>
            
            <a href="/modulos" class="btn-primary">
                Ir a los Módulos 🚀
            </a>
        </article>

        <!-- Aquí podrás duplicar la etiqueta <article class="module-card"> cuando crees nuevas opciones -->
    </section>
</main>

<style>
    * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        background: #F4F6F8; /* Fondo Gris Calmo */
        color: #1E293B;
    }

    .contenedor {
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    /* --- TARJETA DE BIENVENIDA --- */
    .welcome-card {
        background: #FFFFFF;
        border-radius: 16px;
        padding: 2rem 2.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        border: 1px solid #E2E8F0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        width: 75px;
        height: 75px;
        object-fit: contain;
    }

    .btn-logout {
        padding: 8px 16px;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        background: #FFFFFF;
        color: #FC7314; /* Naranja Cálido */
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .btn-logout:hover {
        background: #FFF7ED;
        border-color: #FC7314;
    }

    .welcome-text h1 {
        margin: 0 0 8px 0;
        color: #1E293B;
        font-size: 26px;
        font-weight: 700;
    }

    .welcome-text p {
        margin: 0;
        color: #64748B;
        font-size: 15px;
        line-height: 1.5;
    }

    /* --- GRID DE MÓDULOS --- */
    .grid-modules {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .module-card {
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
        min-height: 220px;
    }

    .card-icon {
        font-size: 32px;
        margin-bottom: 12px;
    }

    .module-card h2 {
        margin: 0 0 8px 0;
        color: #1E293B;
        font-size: 20px;
        font-weight: 600;
    }

    .module-card p {
        color: #64748B;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 20px 0;
    }

    /* Línea superior interactiva (Verde SENA -> Naranja) */
    .module-card::before {
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

    /* Resplandor ambiental inferior */
    .module-card::after {
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

    /* EEFECTOS HOVER */
    .module-card:hover {
        transform: translateY(-5px);
        border-color: rgba(57, 169, 0, 0.3);
        box-shadow: 
            0 12px 24px -6px rgba(57, 169, 0, 0.15),
            0 8px 16px -4px rgba(252, 115, 20, 0.1);
    }

    .module-card:hover::before {
        opacity: 1;
        height: 5px;
    }

    .module-card:hover::after {
        opacity: 1;
        transform: scale(1.3);
    }

    /* BOTÓN PRINCIPAL (VERDE SENA) */
    .btn-primary {
        display: block;
        width: 100%;
        padding: 12px 16px;
        border-radius: 8px;
        background: #39A900;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(57, 169, 0, 0.2);
    }

    .module-card:hover .btn-primary {
        background: linear-gradient(135deg, #39A900 0%, #319200 100%);
        box-shadow: 0 4px 12px rgba(57, 169, 0, 0.3);
    }

    @media (max-width: 640px) {
        .welcome-card {
            padding: 1.5rem;
        }

        .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .btn-logout {
            align-self: flex-end;
        }
    }
</style>