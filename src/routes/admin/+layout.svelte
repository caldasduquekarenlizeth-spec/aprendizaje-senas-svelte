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
                src="/logo_th.png"
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
                    src="/logo_th.png"
                    alt="Foto de perfil"
                    class="profile-image"
                />

            </a>

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

        display: flex;

        align-items: center;
    }


    .profile-link {
        width: 46px;

        height: 46px;

        display: flex;

        align-items: center;

        justify-content: center;

        padding: 2px;

        border-radius: 50%;

        text-decoration: none;

        border:
            2px solid #E2E8F0;

        background: #FFFFFF;

        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }


    .profile-link:hover {
        border-color: #39A900;

        box-shadow:
            0 0 0 3px rgba(57, 169, 0, 0.10);
    }


    .profile-image {
        width: 100%;

        height: 100%;

        border-radius: 50%;

        object-fit: cover;

        display: block;
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


        .profile-link {
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