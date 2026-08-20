<script>
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';

    let correo = $state('');
    let password = $state('');

    let error = $state('');
    let mensaje = $state('');
    let cargando = $state(false);

    let showPassword = $state(false);

    function togglePassword() {
        showPassword = !showPassword;
    }

    /**
     * Maneja el inicio de sesión.
     * @param {SubmitEvent} event
     */
    async function iniciarSesion(event) {
        event.preventDefault();

        error = '';
        mensaje = '';

        if (correo.trim() === '' || password.trim() === '') {
            error = 'El correo y la contraseña son obligatorios.';
            return;
        }

        cargando = true;

        const { data, error: errorSupabase } =
            await supabase.auth.signInWithPassword({
                email: correo.trim(),
                password: password
            });

        cargando = false;

        if (errorSupabase) {
            error = errorSupabase.message;
            return;
        }

        mensaje = 'Inicio de sesión exitoso.';

        await goto('/modulos');
    }
</script>

<svelte:head>
    <title>Iniciar sesión</title>
    <meta
        name="description"
        content="Iniciar sesión en la plataforma de aprendizaje"
    />
    <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
    />
</svelte:head>

<div class="login-container">
    
    <div class="login-card">

        <a href="/" class="btn-home" aria-label="Volver al inicio">
            <i class="fa-solid fa-house"></i>
        </a>
        
        <img src="/logo_th.svg" alt="Logo del proyecto" class="logo" />
        <h1>Iniciar sesión</h1>

        <p class="descripcion">
            Ingresa para continuar aprendiendo lengua de señas.
        </p>

        <form onsubmit={iniciarSesion}>

            <div class="campo">
                <label for="correo">
                    Correo electrónico
                </label>

                <input
                    id="correo"
                    type="email"
                    bind:value={correo}
                    placeholder="ejemplo@correo.com"
                />
            </div>

            <div class="campo">
                <label for="password">
                    Contraseña
                </label>
                
                <div class="input-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        bind:value={password}
                        placeholder="Ingresa tu contraseña"
                    />
                    <button
                        type="button"
                        class="icon-btn"
                        onclick={togglePassword}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        <i class={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </button>
                </div>
            </div>

            {#if error}
                <div class="mensaje error">
                    {error}
                </div>
            {/if}

            {#if mensaje}
                <div class="mensaje exito">
                    {mensaje}
                </div>
            {/if}

            <button
                type="submit"
                disabled={cargando}
            >
                {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

        </form>

        <div class="enlaces">

            <a href="/recuperar">
                ¿Olvidaste tu contraseña?
            </a>

            <p>
                ¿No tienes una cuenta?
                <a href="/registro">Regístrate</a>
            </p>

        </div>

    </div>

</div>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }

    .logo {
        width: 150px;
        height: auto;
        display: block;
        margin: 0 auto 20px;
    }
    :global(*) {
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-container {
        position: relative;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: #F4F6F8;
    }

    .login-card {
        position: relative;
        width: 100%;
        max-width: 450px;
        padding: 35px;
        background: #FFFFFF; /* Blanco Puro */
        border-radius: 12px;
        border: 1px solid #E2E8F0; /* Borde suave */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Sombra tenue */
    }

    h1 {
        text-align: center;
        margin-bottom: 10px;
        color: #1E293B;
    }

    .descripcion {
        text-align: center;
        color: #64748B; /* Gris Muted */
        margin-bottom: 25px;
        font-size: 14px;
    }

    .campo {
        margin-bottom: 18px;
    }

    label {
        display: block;
        margin-bottom: 7px;
        font-weight: 600;
        color: #1E293B; /* Gris Carbón */
        font-size: 14px;
    }

    input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 40px 10px 12px;
        border: 1px solid #CBD5E1;
        border-radius: 6px;
        font-size: 15px;
        color: #1E293B;
        background-color: #FFFFFF;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
        outline: none;
        border-color: #39A900;
        box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.15);
    }

    .input-wrapper{
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
    }

    .icon-btn {
        position: absolute;
        right: 10px;
        width: auto !important;
        height: auto !important;
        background: none !important;
        border: solid 1px #CBD5E1;
        border-radius: 4px;
        cursor: pointer;
        color: #475569 !important;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: none !important;
    }

    .icon-btn i {
        color: #64748B !important;
    }

    .icon-btn:hover {
    color: #333;
    background: transparent !important;
    }

    .icon-btn:hover i {
        color: #39A900 !important;
    }

    button:not(.icon-btn) {
        width: 100%;
        padding: 13px;
        border: none;
        border-radius: 6px;
        background: #39A900;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
    }

    button:not(.icon-btn):hover {
        background: #319200; /* Verde SENA interacción */
    }

    button:not(.icon-btn):active {
        transform: scale(0.99);
    }

    button:not(.icon-btn):disabled {
        background: #94A3B8;
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-home {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        color: #64748B;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .btn-home i {
        font-size: 16px;
        color: #64748B;
        transition: color 0.2s ease;
    }   

    .btn-home:hover {
        background-color: #E2E8F0;
        border-color: #CBD5E1;
        transform: translateY(-1px);
    }

    .btn-home:hover i {
        color: #39A900;
    }

    .mensaje {
        padding: 12px;
        margin-bottom: 15px;
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
    }

    .error {
        background: #FEF2F2;
        color: #991B1B;
        border: 1px solid #FECACA;
    }

    .exito {
        background: #F0FDF4;
        color: #166534;
        border: 1px solid #BBF7D0;
    }

    .enlaces {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
    }

    .enlaces a {
        color: #FC7314; /* Naranja Cálido para accesos/links */
        text-decoration: none;
        font-weight: 600;
    }

    .enlaces a:hover {
        text-decoration: underline;
    }

    .enlaces p {
        margin-top: 15px;
        color: #64748B;
    }
</style>