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

    <!-- =========================
            BARRA DE NAVEGACIÓN
    ========================= -->

    <header class="navbar">

        <!-- LOGO -->
        <a href="/admin" class="brand">

            <img
                src="/logo_th.svg"
                alt="Logo de Talking Hands"
            />

            <span class="brand-name">
                Talking Hands
            </span>

        </a>


        <!-- =========================
                NAVEGACIÓN
        ========================= -->

        <nav class="navigation">
    
            <!-- INICIO -->
            <a
                href="/admin"
                class="nav-link"
            >
                Inicio
            </a>
        
        
            <!-- GESTIONAR -->
            <details class="dropdown">
        
                <summary class="nav-link dropdown-button">
                    Gestionar
                    <span class="arrow"></span>
                </summary>
        
        
                <div class="dropdown-menu">
        
                    <a href="/admin/usuarios">
                        Usuarios
                    </a>
        
                    <a href="/admin/modulos">
                        Módulos
                    </a>
        
                    <a href="/admin/logros">
                        Logros
                    </a>
        
                </div>
        
            </details>
        
        
            <!-- PERFIL -->
            <a
                href="/admin/perfil"
                class="nav-link"
            >
                Perfil
            </a>
        
        
            <!-- RANKING -->
            <a
                href="/admin/ranking"
                class="nav-link"
            >
                Ranking
            </a>
    
    </nav>
    

        <!-- =========================
                FOTO DE PERFIL
        ========================= -->

        <div class="profile-container">

            <a
                href="/admin/perfil"
                class="profile-link"
                aria-label="Ir al perfil"
            >

                <!--
                    Por ahora usamos el logo como imagen
                    temporal de perfil.
                    Posteriormente podemos reemplazar
                    esta imagen por la foto del usuario
                    almacenada en Supabase.
                -->

                <img
                    src="/logo_th.svg"
                    alt="Foto de perfil"
                    class="profile-image"
                />

            </a>

        <div class="logo-container">
            <img src="/logo_th.svg" alt="Logo de Talking Hands" />
            <h2 class="sidebar-text">Talking Hands</h2>
            <span class="sidebar-text">Administrador</span>
        </div>

        <nav class="sidebar-element">
            <a href="/admin">
                <span class="icon">🏠</span>
                <span class="sidebar-text">Dashboard</span>
            </a>

            <a href="/admin/usuarios">
                <span class="icon">👥</span>
                <span class="sidebar-text">Usuarios</span>
            </a>

            <a href="/admin/modulos">
                <span class="icon">📚</span>
                <span class="sidebar-text">Módulos</span>
            </a>

            <a href="/admin/lecciones">
                <span class="icon">📖</span>
                <span class="sidebar-text">Lecciones</span>
            </a>

            <a href="/admin/senas">
                <span class="icon">🤟</span>
                <span class="sidebar-text">Señas</span>
            </a>
        </nav>

        <div class="sidebar-bottom">
            <button type="button" onclick={cerrarSesion} title="Cerrar sesión">
                <span class="icon">🚪</span>
                <span class="sidebar-text">Cerrar sesión</span>
            </button>
        </div>

    </aside>


    <!-- =========================
            CONTENIDO PRINCIPAL
    ========================= -->

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
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    :global(body) {
        margin: 0;
        background: #F4F6F8;
        color: #1E293B;
    }

    /* =========================
        ESTRUCTURA
    ========================= */
    .admin-layout {
        min-height: 100vh;
        display: flex;
    }

    /* =========================
        BARRA SUPERIOR
    ========================= */
    .sidebar {
        width: 250px;
        min-height: 100vh;
        background: #1E293B;
        color: white;

        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;

        z-index: 1000;
    }


    /* =========================
        MARCA / LOGO
    ========================= */

    .brand {
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        transition: width 0.3s ease;
        z-index: 100;
    }

    .logo-container {
        padding: 25px 15px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo-container img {
        width: 60px;
        height: auto;
        display: block;
        margin: 0 auto 10px;
        object-fit: contain;
    }

    .logo-container h2 {
        margin: 0;
        font-size: 18px;
        color: white;
    }

    .logo-container span.sidebar-text {
        display: block;
        margin-top: 5px;
        color: #94A3B8;
        font-size: 13px;
        font-weight: 500;
    }

    /* =========================
        NAVEGACIÓN
    ========================= */
    .sidebar-element {
        display: flex;
        flex-direction: column;
        padding: 15px 10px;
        gap: 5px;
    }

    .sidebar-element a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        border-radius: 8px;
        color: #E2E8F0;
        text-decoration: none;

        font-family: inherit;

        font-size: 14px;

        font-weight: 600;

        cursor: pointer;

        transition:
            background 0.2s ease,
            color 0.2s ease;
    }


    .nav-link:hover {
        background: rgba(57, 169, 0, 0.10);

        color: #39A900;
    }


    /* =========================
        GESTIONAR
    ========================= */

    .dropdown {
    position: relative;
    }
    
    
    /* Quitar el marcador predeterminado de details */
    .dropdown summary {
        list-style: none;
    }
    
    
    /* Compatibilidad con algunos navegadores */
    .dropdown summary::-webkit-details-marker {
        display: none;
    }
    
    
    .dropdown-button {
        justify-content: center;
    
        user-select: none;
    }
    
    
    /* Flecha */
    .arrow {
        width: 7px;
    
        height: 7px;
    
        margin-left: 4px;
    
        border-right: 1.5px solid #64748B;
    
        border-bottom: 1.5px solid #64748B;
    
        transform: rotate(45deg) translateY(-2px);
    
        transition: transform 0.2s ease;
    }
    
    
    /* Cuando el menú está abierto */
    .dropdown[open] .arrow {
        transform: rotate(225deg) translateY(-2px);
    }

    /* =========================
        MENÚ DESPLEGABLE
    ========================= */

    .dropdown-menu {
        position: absolute;

        top: 50px;

        left: 0;

        min-width: 180px;

        padding: 7px;

        background: #FFFFFF;

        border:
            1px solid #E2E8F0;

        border-radius: 10px;

        box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.12);

        z-index: 1100;
    }


    .dropdown-menu a {
        display: block;

        padding: 11px 13px;

        border-radius: 7px;

        color: #1E293B;

        text-decoration: none;

        font-size: 14px;

        font-weight: 500;
        transition: background 0.2s, color 0.2s, transform 0.2s;
    }

    .sidebar-element a:hover {
        background: rgba(57, 169, 0, 0.2);
        color: #ffffff;
        transform: translateX(3px);
    }

    .sidebar-element a .icon {
        font-size: 18px;
        min-width: 24px;
        text-align: center;
    }

    /* =========================
        FOTO DE PERFIL
    ========================= */
    .sidebar-bottom {
        margin-top: auto;
        padding: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        background: #FC7314;
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
        transition: margin-left 0.3s ease, width 0.3s ease;
    }

    .topbar {
        height: 70px;
        background: white;
        border-bottom: 1px solid #E2E8F0;
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
        color: #39A900;
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
            width: 70px;
        }

        .main {
            margin-left: 70px;
            width: calc(100% - 70px);
        }

        /* Ocultar todos los textos del sidebar */
        .sidebar-text {
            display: none !important;
        }

        /* Centrar íconos en el menú */
        .logo-container {
            padding: 15px 5px;
        }

        .logo-container img {
            width: 35px;
            margin-bottom: 0;
        }

        .sidebar-element {
            padding: 10px 5px;
        }

        .sidebar-element a {
            justify-content: center;
            padding: 12px 0;
        }

        .sidebar-element a:hover {
            transform: none; /* Desactivar traslación en pantallas chicas */
        }

        .sidebar-bottom {
            padding: 10px 5px;
        }

        button {
            padding: 12px;
        }

        .content {
            padding: 15px;
        }
    }
</style>