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
    .login-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: #f4f6f8;
    }

    .login-card {
        width: 100%;
        max-width: 450px;
        padding: 35px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 10px;
    }

    .descripcion {
        text-align: center;
        color: #666;
        margin-bottom: 25px;
    }

    .campo {
        margin-bottom: 18px;
    }

    label {
        display: block;
        margin-bottom: 7px;
        font-weight: 600;
    }

    input {
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 15px;
    }

    input:focus {
        outline: none;
        border-color: #555;
    }

    button {
        width: 100%;
        padding: 13px;
        border: none;
        border-radius: 6px;
        background: #222;
        color: white;
        font-size: 16px;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .mensaje {
        padding: 12px;
        margin-bottom: 15px;
        border-radius: 6px;
        text-align: center;
    }

    .error {
        background: #ffe5e5;
        color: #a00000;
    }

    .exito {
        background: #e5f7e8;
        color: #176b2c;
    }

    .enlaces {
        text-align: center;
        margin-top: 20px;
    }

    .enlaces p {
        margin-top: 15px;
    }
</style>