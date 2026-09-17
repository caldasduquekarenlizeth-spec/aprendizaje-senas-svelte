<script>
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    let { data, children } = $props();

    let menuAbierto = $state(false);

    function toggleMenu() {
        menuAbierto = !menuAbierto;
    }

    function cerrarMenu() {
        menuAbierto = false;
    }

    async function cerrarSesion() {
        cerrarMenu();

        await supabase.auth.signOut();
        await goto('/login');
    }

    onMount(() => {
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                invalidate('supabase:auth');
            }
        });

        return () => subscription.unsubscribe();
    });
</script>


<div class="aprendiz-layout">

    <!-- =========================
        BARRA DE NAVEGACIÓN
    ========================= -->

    <header class="navbar">

        <!-- LOGO -->
        <a href="/aprendiz" class="brand">

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
                href="/aprendiz"
                class="nav-link"
            >
                Inicio
            </a>


            <!-- PERFIL -->
            <a
                href="/aprendiz/perfil"
                class="nav-link"
            >
                Perfil
            </a>


            <!-- LECCIONES -->
            <a
                href="/aprendiz/lecciones"
                class="nav-link"
            >
                Lecciones
            </a>


            <!-- PROGRESO -->
            <a
                href="/aprendiz/progreso"
                class="nav-link"
            >
                Progreso
            </a>


            <!-- RANKING -->
            <a
                href="/aprendiz/ranking"
                class="nav-link"
            >
                Ranking
            </a>

        </nav>


        <!-- =========================
            FOTO DE PERFIL
        ========================= -->

        <div class="profile-container">

            <button
                type="button"
                class="profile-button"
                onclick={toggleMenu}
                aria-expanded={menuAbierto}
                aria-label="Menú de usuario"
            >

                <img
                    src="/foto_perfil.svg"
                    alt="Foto de perfil"
                    class="profile-image"
                />

                <svg
                    class="dropdown-arrow {menuAbierto ? 'open' : ''}"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M0 0h20v20H0z"
                        fill="none"
                    />

                    <path
                        fill="currentColor"
                        d="m5 6l5 5l5-5l2 1l-7 7l-7-7z"
                    />
                </svg>

            </button>


            <!-- MENÚ DESPLEGABLE -->

            {#if menuAbierto}

                <!-- Fondo transparente para cerrar -->
                <div
                    class="menu-backdrop"
                    onclick={cerrarMenu}
                    role="presentation"
                ></div>


                <div class="profile-dropdown-menu">

                    <!-- MI PERFIL -->

                    <a
                        href="/aprendiz/perfil"
                        class="dropdown-item"
                        onclick={cerrarMenu}
                    >

                        <svg viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>

                        Mi Perfil

                    </a>


                    <hr class="dropdown-divider" />


                    <!-- CERRAR SESIÓN -->

                    <button
                        type="button"
                        class="dropdown-item logout"
                        onclick={cerrarSesion}
                    >

                        <svg viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>

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

    .aprendiz-layout {
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
        transition:
            background-color 0.2s ease;
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
        transition:
            transform 0.2s ease;
    }


    .dropdown-arrow.open {
        transform: rotate(180deg);
    }


    /* =========================
        FONDO DEL MENÚ
    ========================= */

    .menu-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 90;
    }


    /* =========================
        MENÚ DE PERFIL
    ========================= */

    .profile-dropdown-menu {
        position: absolute;
        right: -10px;
        top: calc(100% + 8px);
        width: 200px;
        background: white;
        border:
            1px solid #E2E8F0;
        border-radius: 12px;
        padding: 8px 0;
        box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.08);
        z-index: 100;
        animation:
            fadeIn 0.15s ease-out;
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
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
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
        border-top:
            1px solid #E2E8F0;
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
        ANIMACIÓN
    ========================= */

    @keyframes fadeIn {

        from {
            opacity: 0;
            transform: translateY(-5px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }

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