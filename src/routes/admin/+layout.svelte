<script>
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    let { children } = $props();

    async function cerrarSesion() {
        await supabase.auth.signOut();
        await goto('/login');
    }
</script>

<div class="admin-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <div class="logo-container">

            <img
                src="/logo_th.svg"
                alt="Logo de Talking Hands"
            />

            <h2>Talking Hands</h2>

            <span>Administrador</span>

        </div>

        <nav>

            <a href="/admin">
                <span>🏠</span>
                Dashboard
            </a>

            <a href="/admin/usuarios">
                <span>👥</span>
                Usuarios
            </a>

            <a href="/admin/modulos">
                <span>📚</span>
                Módulos
            </a>

            <a href="/admin/lecciones">
                <span>📖</span>
                Lecciones
            </a>

            <a href="/admin/senas">
                <span>🤟</span>
                Señas
            </a>

        </nav>

        <div class="sidebar-bottom">

            <button
                type="button"
                onclick={cerrarSesion}
            >
                <span>🚪</span>
                Cerrar sesión
            </button>

        </div>

    </aside>


    <!-- CONTENIDO PRINCIPAL -->
    <div class="main">

        <header class="topbar">

            <div>
                <h1>Panel administrativo</h1>
            </div>

            <div class="admin-badge">
                Administrador
            </div>

        </header>


        <main class="content">

            {@render children()}

        </main>

    </div>

</div>


<style>

    :global(*) {
        box-sizing: border-box;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
    }

    :global(body) {
        margin: 0;
        background: #F4F6F8; /* Gris Calmo */
        color: #1E293B; /* Gris Carbón */
    }


    /* =========================
       ESTRUCTURA
    ========================= */

    .admin-layout {
        min-height: 100vh;
        display: flex;
    }


    /* =========================
       SIDEBAR
    ========================= */

    .sidebar {
        width: 250px;
        min-height: 100vh;
        background: #1E293B; /* Gris Carbón SENA */
        color: white;

        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;

        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }


    .logo-container {
        padding: 25px 20px;
        text-align: center;

        border-bottom:
            1px solid rgba(255, 255, 255, 0.1);
    }


    .logo-container img {
        width: 75px;
        height: auto;
        display: block;
        margin: 0 auto 10px;
        object-fit: contain;
    }


    .logo-container h2 {
        margin: 0;
        font-size: 20px;
        color: white;
    }


    .logo-container span {
        display: block;
        margin-top: 5px;

        color: #94A3B8;
        font-size: 13px;
        font-weight: 500;
    }


    /* =========================
       NAVEGACIÓN
    ========================= */

    nav {
        display: flex;
        flex-direction: column;

        padding: 20px 12px;

        gap: 6px;
    }


    nav a {
        display: flex;
        align-items: center;

        gap: 12px;

        padding: 13px 15px;

        border-radius: 8px;

        color: #E2E8F0;

        text-decoration: none;

        font-size: 15px;

        font-weight: 500;

        transition:
            background 0.2s,
            color 0.2s,
            transform 0.2s;
    }


    nav a:hover {
        background: rgba(57, 169, 0, 0.15); /* Tint Verde SENA */
        color: #ffffff;
        transform: translateX(3px);
    }


    nav a span {
        width: 22px;
        text-align: center;
    }


    /* =========================
       BOTÓN CERRAR SESIÓN
    ========================= */

    .sidebar-bottom {
        margin-top: auto;

        padding: 20px;

        border-top:
            1px solid rgba(255, 255, 255, 0.1);
    }


    button {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 8px;

        padding: 11px;

        border: none;
        border-radius: 8px;

        background: #FC7314; /* Naranja Cálido */

        color: white;

        font-size: 14px;
        font-weight: 600;

        cursor: pointer;

        box-shadow: 0 4px 12px rgba(252, 115, 20, 0.25);

        transition: background 0.2s, transform 0.2s;
    }


    button:hover {
        background: #E96108;
        transform: translateY(-1px);
    }


    /* =========================
       CONTENIDO
    ========================= */

    .main {
        margin-left: 250px;

        width: calc(100% - 250px);

        min-height: 100vh;
    }


    .topbar {
        height: 70px;

        background: white;

        border-bottom:
            1px solid #E2E8F0;

        display: flex;

        align-items: center;

        justify-content: space-between;

        padding: 0 30px;
    }


    .topbar h1 {
        margin: 0;

        color: #1E293B;

        font-size: 18px;
        font-weight: 700;
    }


    .admin-badge {
        padding: 6px 14px;

        border-radius: 20px;

        background: #F0FDF4;

        border: 1px solid rgba(57, 169, 0, 0.3);

        color: #39A900; /* Verde SENA */

        font-size: 13px;

        font-weight: 600;
    }


    .content {
        padding: 30px;
    }


    /* =========================
       RESPONSIVE
    ========================= */

    @media (max-width: 768px) {

        .sidebar {
            width: 210px;
        }

        .main {
            margin-left: 210px;

            width: calc(100% - 210px);
        }

        .content {
            padding: 20px;
        }

    }


    @media (max-width: 600px) {

        .sidebar {
            width: 70px;
        }

        .logo-container h2,
        .logo-container span,
        .sidebar-bottom button span:nth-child(2) {
            display: none;
        }

        .logo-container img {
            width: 40px;
        }

        .main {
            margin-left: 70px;

            width: calc(100% - 70px);
        }

    }

</style>