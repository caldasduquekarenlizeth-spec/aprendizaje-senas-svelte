<script>
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient';

/** @type {import('@supabase/supabase-js').User | null} */
let usuario = $state(null);

/** @type {{ nombre: string } | null} */
let perfil = $state(null);
let cargando = $state(true);

onMount(async () => {
    // 1. Obtener la sesión actual del cliente
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        goto('/login');
        return;
    }
    
    usuario = session.user;

    // 2. Traer el perfil del usuario
    const { data: datosPerfil } = await supabase
    .from('profiles')
    .select('nombre')
    .eq('id', session.user.id)
    .maybeSingle();

    if (datosPerfil) {
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
    <title>Módulos | Talking Hands</title>
    <meta name="description" content="Módulos de aprendizaje de lengua de señas" />
</svelte:head>

{#if cargando}
    <div class="pantalla-carga">
    <div class="spinner"></div>
    <p>Verificando acceso...</p>
    </div>
{:else}
<main class="contenedor">
    <header class="encabezado">
    <div class="titulo-modulos">
        <img src="/logo_th.svg" alt="Logo Talking Hands" class="logo" />
        <div class="informacion-usuario">
            <h1>Módulos de Aprendizaje</h1>
            <p>Bienvenido, {perfil?.nombre || usuario?.email}</p>
        </div>
    </div>

    <div class="acciones-header">
        <a href="/aprendiz" class="btn-volver">Volver al Dashboard</a>
        <button onclick={cerrarSesion} class="btn-logout">Cerrar sesión</button>
    </div>
    </header>

    <section class="grid-modulos">
    <article class="modulo">
        <div class="modulo-header">
            <span class="badge">Nivel 1</span>
            <h2>Módulo 1</h2>
        </div>
        <p>Introducción a la lengua de señas y conceptos básicos.</p>
        <button class="btn-modulo">Ver módulo</button>
    </article>

    <article class="modulo">
        <div class="modulo-header">
            <span class="badge">Nivel 2</span>
            <h2>Módulo 2</h2>
        </div>
        <p>Comunicación básica, saludos y expresiones cotidianas.</p>
        <button class="btn-modulo">Ver módulo</button>
    </article>

    <article class="modulo">
        <div class="modulo-header">
            <span class="badge">Nivel 3</span>
            <h2>Módulo 3</h2>
        </div>
        <p>Vocabulario extendido, familia y entorno.</p>
        <button class="btn-modulo">Ver módulo</button>
    </article>
    </section>
</main>
{/if}

<style>
  * {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-sizing: border-box;
}

:global(body) {
    margin: 0;
    background: #F4F6F8;
    color: #1E293B;
}

  /* --- SPINNER DE CARGA --- */
.pantalla-carga {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    color: #64748B;
}

.spinner {
    width: 38px;
    height: 38px;
    border: 4px solid #E2E8F0;
    border-top: 4px solid #39A900;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.contenedor {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* --- ENCABEZADO --- */
.encabezado {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 1.5rem 2rem;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.titulo-modulos {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo {
    width: 70px;
    height: 70px;
    object-fit: contain;
}

.informacion-usuario h1 {
    margin: 0 0 4px 0;
    font-size: 26px;
    font-weight: 700;
    color: #1E293B;
}

.informacion-usuario p {
    margin: 0;
    color: #64748B;
    font-size: 15px;
}

.acciones-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-volver {
    padding: 9px 16px;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    background: #FFFFFF;
    color: #1E293B;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-volver:hover {
    background: #F8FAFC;
    border-color: #94A3B8;
}

.btn-logout {
    padding: 9px 16px;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    background: #FFFFFF;
    color: #FC7314;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-logout:hover {
    background: #FFF7ED;
    border-color: #FC7314;
}

/* --- GRID DE MÓDULOS --- */
.grid-modulos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
}

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
    min-height: 210px;
}

.modulo-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.badge {
    background: #E8F5E9;
    color: #39A900;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 12px;
}

.modulo h2 {
    margin: 4px 0 0 0;
    color: #1E293B;
    font-size: 20px;
    font-weight: 600;
}

.modulo p {
    color: #64748B;
    font-size: 14px;
    line-height: 1.5;
    margin: 12px 0 20px 0;
}

/* Línea superior interactiva (Verde SENA -> Naranja) */
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

/* Resplandor ambiental inferior */
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

/* EFECTOS HOVER */
.modulo:hover {
    transform: translateY(-5px);
    border-color: rgba(57, 169, 0, 0.3);
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

/* BOTÓN DEL MÓDULO (VERDE SENA) */
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
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(57, 169, 0, 0.2);
}

.modulo:hover .btn-modulo {
    background: linear-gradient(135deg, #39A900 0%, #319200 100%);
    box-shadow: 0 4px 12px rgba(57, 169, 0, 0.3);
}

@media (max-width: 768px) {
    .encabezado {
    flex-direction: column;
    align-items: flex-start;
}

.acciones-header {
    width: 100%;
    justify-content: space-between;
}

.btn-volver, .btn-logout {
    flex: 1;
    text-align: center;
}
}
</style>