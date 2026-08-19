<script>
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    let correo = $state('');
    let password = $state('');

    let error = $state('');
    let mensaje = $state('');
    let cargando = $state(false);

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
</svelte:head>

<div class="login-container">
     
    <div class="login-card">
        <img src="/logo_th.png" alt="Logo del proyecto" class="logo" />
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

                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    placeholder="Ingresa tu contraseña"
                />
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
    .logo {
        width: 150px;
        height: auto;
        display: block;
        margin: 0 auto 20px;
    }
    * {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: #F4F6F8; /* Gris Calmo de fondo */
    }

    .login-card {
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
        color: #1E293B; /* Gris Carbón */
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
        padding: 12px;
        border: 1px solid #CBD5E1; /* Borde gris sutil */
        border-radius: 6px;
        font-size: 15px;
        color: #1E293B;
        background-color: #FFFFFF;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
        outline: none;
        border-color: #39A900; /* Verde SENA al enfocar */
        box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.15); /* Resplandor suave verde */
    }

    button {
        width: 100%;
        padding: 13px;
        border: none;
        border-radius: 6px;
        background: #39A900; /* Verde SENA */
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
    }

    button:hover {
        background: #319200; /* Verde SENA interacción */
    }

    button:active {
        transform: scale(0.99);
    }

    button:disabled {
        background: #94A3B8;
        opacity: 0.6;
        cursor: not-allowed;
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