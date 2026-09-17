
<svelte:head>
    <title>Inicio | Talking Hands</title>
    <meta
        name="description"
        content="Inicio del área de aprendizaje de Talking Hands"
    />
</svelte:head>

<main class="contenedor">

    <section class="bienvenida">

        <div class="contenido">
            <span class="etiqueta">TALKING HANDS</span>

            <h1>
                ¡Bienvenido a tu espacio de aprendizaje!
            </h1>

            <p>
                Aprende lengua de señas de manera sencilla, progresiva
                y práctica.
            </p>

            <a href="/aprendiz/lecciones" class="boton">
                Comenzar a aprender
            </a>
        </div>

        <div class="decoracion">
            <img
                src="/logo_th.svg"
                alt="Talking Hands"
            />
        </div>

    </section>

    <section class="accesos">

        <h2>Accesos rápidos</h2>

        <div class="tarjetas">

            <a href="/aprendiz/lecciones" class="tarjeta">
                <div class="icono verde">
                    📚
                </div>

                <div>
                    <h3>Lecciones</h3>
                    <p>
                        Explora los módulos y continúa aprendiendo.
                    </p>
                </div>
            </a>

            <a href="/aprendiz/progreso" class="tarjeta">
                <div class="icono naranja">
                    📈
                </div>

                <div>
                    <h3>Mi progreso</h3>
                    <p>
                        Consulta tu avance en el aprendizaje.
                    </p>
                </div>
            </a>

            <a href="/aprendiz/ranking" class="tarjeta">
                <div class="icono verde">
                    🏆
                </div>

                <div>
                    <h3>Ranking</h3>
                    <p>
                        Consulta tu posición y tus logros.
                    </p>
                </div>
            </a>

        </div>

    </section>

</main>

<style>
    * {
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, sans-serif;
    }

    .contenedor {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .bienvenida {
        position: relative;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        padding: 45px;
        border-radius: 18px;
        overflow: hidden;
        background: linear-gradient(
            135deg,
            #39A900 0%,
            #319200 55%,
            #FC7314 100%
        );
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    .contenido {
        position: relative;
        z-index: 2;
        max-width: 650px;
    }

    .etiqueta {
        display: inline-block;
        margin-bottom: 15px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1.5px;
    }

    .bienvenida h1 {
        margin: 0 0 15px;
        color: #FFFFFF;
        font-size: 38px;
        line-height: 1.15;
        font-weight: 700;
    }

    .bienvenida p {
        margin: 0 0 28px;
        max-width: 560px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 17px;
        line-height: 1.6;
    }

    .boton {
        display: inline-block;
        padding: 13px 22px;
        border-radius: 8px;
        background: #FFFFFF;
        color: #39A900;
        font-size: 15px;
        font-weight: 700;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .boton:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .decoracion {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 180px;
    }

    .decoracion img {
        width: 180px;
        height: 180px;
        object-fit: contain;
        filter: brightness(0) invert(1);
        opacity: 0.9;
    }

    .accesos {
        margin-top: 45px;
    }

    .accesos h2 {
        margin: 0 0 20px;
        color: #1E293B;
        font-size: 24px;
    }

    .tarjetas {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .tarjeta {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 22px;
        border: 1px solid #E2E8F0;
        border-radius: 14px;
        background: #FFFFFF;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        text-decoration: none;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
    }

    .tarjeta:hover {
        transform: translateY(-4px);
        border-color: rgba(57, 169, 0, 0.3);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.07);
    }

    .icono {
        min-width: 48px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-size: 23px;
    }

    .icono.verde {
        background: #F0FDF4;
    }

    .icono.naranja {
        background: #FFF7ED;
    }

    .tarjeta h3 {
        margin: 2px 0 7px;
        color: #1E293B;
        font-size: 17px;
    }

    .tarjeta p {
        margin: 0;
        color: #64748B;
        font-size: 14px;
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .contenedor {
            padding: 25px 20px;
        }

        .bienvenida {
            flex-direction: column;
            align-items: flex-start;
            padding: 30px;
        }

        .bienvenida h1 {
            font-size: 30px;
        }

        .decoracion {
            display: none;
        }

        .tarjetas {
            grid-template-columns: 1fr;
        }
    }
</style>