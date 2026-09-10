<script>
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    let { children } = $props();
    let menuAbierto = $state(false);

    function toggleMenu() {
        menuAbierto = !menuAbierto;
    }

    function cerrarMenu() {
        menuAbierto = false;
    }

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
                <!-- Botón para abrir/cerrar el menú -->
                <button 
                    type="button" 
                    class="profile-button" 
                    onclick={toggleMenu}
                    aria-expanded={menuAbierto}
                    aria-label="Menú de usuario"
                >
                    <img
                        src="/logo_th.svg"
                        alt="Foto de perfil"
                        class="profile-image"
                    />
                    <!-- Flecha indicadora -->
                    <svg 
                        class="dropdown-arrow {menuAbierto ? 'open' : ''}" 
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                        <path d="M0 0h20v20H0z" fill="none" />
                        <path fill="currentColor" d="m5 6l5 5l5-5l2 1l-7 7l-7-7z" />
                    </svg>
                </button>

                <!-- Menú Desplegable -->
                {#if menuAbierto}
                    <!-- Backdrop transparente para cerrar el menú al hacer clic afuera -->
                    <div class="menu-backdrop" onclick={cerrarMenu} role="presentation"></div>

                    <div class="profile-dropdown-menu">
                        <a href="/admin/perfil" class="dropdown-item" onclick={cerrarMenu}>
                            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
                            Mi Perfil
                        </a>
                        
                        <hr class="dropdown-divider" />

                        <button type="button" class="dropdown-item logout" onclick={cerrarSesion}>
                            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                {/if}
            </div>

    </header>


    <!-- =========================
        CONTENIDO PRINCIPAL
    ========================= -->

    <main class="content">

        {@render children()}

    </main>

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
        background: #F4F6F8;
        color: #1E293B;
    }


    /* =========================
        ESTRUCTURA
    ========================= */

    .admin-layout {
        min-height: 100vh;
        background: #F4F6F8;
    }


    /* =========================
        BARRA SUPERIOR
    ========================= */

    .navbar {
        width: 100%;
        height: 76px;
        display: flex;
        align-items: center;
        padding: 0 30px;
        gap: 40px;
        background: #FFFFFF;
        border-bottom:
            1px solid #E2E8F0;
        box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.04);
        position: sticky;
        top: 0;
        z-index: 1000;
    }


    /* =========================
        MARCA / LOGO
    ========================= */

    .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 205px;
        text-decoration: none;
    }


    .brand img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        display: block;
    }


    .brand-name {
        color: #1E293B;
        font-size: 18px;
        font-weight: 700;
        white-space: nowrap;
    }


    /* =========================
        NAVEGACIÓN
    ========================= */

    .navigation {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 5px;
    }


    .nav-link {
        height: 42px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 15px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: #1E293B;
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
        transition:
            background 0.2s ease,
            color 0.2s ease;
    }


    .dropdown-menu a:hover {
        background: rgba(57, 169, 0, 0.10);

        color: #39A900;
    }


    /* =========================
        FOTO DE PERFIL
    ========================= */

    .profile-container {
        margin-left: auto;
        position: relative;
        display: inline-block;
    }

    .profile-button {
    background: transparent;
    border: none;
    padding: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 50px;
    transition: background-color 0.2s ease;
    }

    .profile-button:hover {
    background-color: #F1F5F9;
    }

    .profile-image {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #E2E8F0;
    }

    .dropdown-arrow {
    width: 16px;
    height: 16px;
    color: #64748B;
    transition: transform 0.2s ease;
    }

    .dropdown-arrow.open {
    transform: rotate(180deg);
    }

    .menu-backdrop {
    position:fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 90;
    }

    .profile-dropdown-menu {
    position: absolute;
    right: -10px;
    top: calc(100% + 8px);
    width: 200px;
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 8px 0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    z-index: 100;
    animation: fadeIn 0.15s ease-out;
    }

    .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    color: #1E293B;
    text-decoration: none;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color 0.2s ease, color 0.2s ease;
    }

    .dropdown-item svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    }

    .dropdown-item:hover {
    background-color: #F8FAFC;
    color: #39A900;
    }

    .dropdown-item.logout {
    color: #FC7314;
    }

    .dropdown-item.logout:hover {
    background-color: #FFF7ED;
    }

    .dropdown-divider {
    border: none;
    border-top: 1px solid #E2E8F0;
    margin: 6px 0;
    }

    /* =========================
        CONTENIDO
    ========================= */

    .content {
        width: 100%;
        min-height:
            calc(100vh - 76px);
        padding: 30px;
    }


    /* =========================
        RESPONSIVE
    ========================= */

    @media (max-width: 1100px) {

        .navbar {
            gap: 15px;

            padding: 0 20px;
        }

        .brand {
            min-width: auto;
        }

        .navigation {
            gap: 2px;
        }

        .nav-link {
            padding: 0 11px;
        }
    }


    @media (max-width: 800px) {

        .navbar {
            height: auto;
            min-height: 76px;
            flex-wrap: wrap;
            padding: 12px 20px;
            gap: 10px;
        }


        .navigation {
            order: 3;
            width: 100%;
            height: 45px;
            overflow-x: auto;
        }


        .profile-container {
            margin-left: auto;
        }


        .content {
            padding: 20px;
        }

    }


    @media (max-width: 600px) {

        .brand-name {
            font-size: 16px;
        }


        .brand img {
            width: 42px;
            height: 42px;
        }

        .nav-link {
            padding: 0 10px;
            font-size: 13px;
            white-space: nowrap;
        }

    }

</style>