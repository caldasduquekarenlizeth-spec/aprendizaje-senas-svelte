<script>
    import { supabase } from "$lib/supabaseClient";

    let correo = $state('');
    let mensaje = $state('');
    let error = $state('');
    let cargando = $state(false);

    /**
     * Maneja el inicio de sesión.
     * @param {SubmitEvent} event
     */

    async function recuperarCuenta(event) {
        event.preventDefault();

        error = '';
        mensaje = '';

        if (correo.trim() === '') {
            error = 'Debes escribir una dirección de correo electrónico.';
            return;
        }

        cargando = true;

        const {data, error: errorSupabase } =
            await supabase.auth.resetPasswordForEmail(correo, {
                redirectTo: 'http://localhost:5173/reset-password'
            });

        cargando = false;

        if (errorSupabase) {
            error = errorSupabase.message;
            return
        }

        mensaje = 'Se ha enviado un correo de recuperación a la dirección suministrada.'
    }
</script>

<svelte:head>
    <title>Recuperar cuenta</title>
    <meta
        name="description"
        content="Recuperar contraseña por medio de correo electrónico"
    />
</svelte:head>

<div class="recover-container">
        
    <div class="recovery-card">
        
        <h1>Recuperar contraseña</h1>

        <p class="descripcion">
            Escribe tu dirección de correo para recuperar tu cuenta.
        </p>

        <form onsubmit={recuperarCuenta}>

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
                {cargando ? 'Enviando enlace...' : 'Enviar'}
            </button>
        </form>

    </div>
</div>

<style>
    .recover-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: #F4F6F8;
    }

    .recovery-card {
        width: 100%;
        max-width: 450px;
        padding: 35px;
        background: #FFFFFF;
        border-radius: 12px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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
</style>