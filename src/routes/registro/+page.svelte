<script>
    import { supabase } from '$lib/supabase';

    let nombre = $state('');
    let correo = $state('');
    let password = $state('');
    let confirmarPassword = $state('');

    let error = $state('');
    let mensaje = $state('');
/**
 * Maneja el envío del formulario de registro.
 * @param {SubmitEvent} event
 */

    async function registrarUsuario(event) {
    event.preventDefault();

    error = '';
    mensaje = '';

    if (
        nombre.trim() === '' ||
        correo.trim() === '' ||
        password.trim() === '' ||
        confirmarPassword.trim() === ''
    ) {
        error = 'Todos los campos son obligatorios.';
        return;
    }

    if (password !== confirmarPassword) {
        error = 'Las contraseñas no coinciden.';
        return;
    }

    if (password.length < 6) {
        error = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }

    const { data, error: errorSupabase } = await supabase.auth.signUp({
        email: correo.trim(),
        password: password
    });

    if (errorSupabase) {
        error = errorSupabase.message;
        return;
    }

    console.log('Usuario registrado:', data);

    mensaje = 'Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta.';
}
</script>

<svelte:head>
    <title>Crear cuenta</title>
</svelte:head>

<div class="registro-container">

    <div class="registro-card">

        <h1>Crear una cuenta</h1>

        <p class="descripcion">
            Regístrate para comenzar a aprender lengua de señas.
        </p>

        <form onsubmit={registrarUsuario}>

            <div class="campo">
                <label for="nombre">Nombre</label>

                <input
                    id="nombre"
                    type="text"
                    bind:value={nombre}
                    placeholder="Ingresa tu nombre"
                />
            </div>

            <div class="campo">
                <label for="correo">Correo electrónico</label>

                <input
                    id="correo"
                    type="email"
                    bind:value={correo}
                    placeholder="ejemplo@correo.com"
                />
            </div>

            <div class="campo">
                <label for="password">Contraseña</label>

                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    placeholder="Ingresa tu contraseña"
                />
            </div>

            <div class="campo">
                <label for="confirmarPassword">
                    Confirmar contraseña
                </label>

                <input
                    id="confirmarPassword"
                    type="password"
                    bind:value={confirmarPassword}
                    placeholder="Repite tu contraseña"
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

            <button type="submit">
                Crear cuenta
            </button>

        </form>

        <p class="login-link">
            ¿Ya tienes una cuenta?
            <a href="/login">Inicia sesión</a>
        </p>

    </div>

</div>

<style>
    .registro-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: #f4f6f8;
    }

    .registro-card {
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
        margin-bottom: 25px;
        color: #666;
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
        font-size: 16px;
        cursor: pointer;
        background: #222;
        color: white;
    }

    button:hover {
        opacity: 0.9;
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

    .login-link {
        text-align: center;
        margin-top: 20px;
    }
</style>