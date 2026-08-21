<script>
    let { data } = $props();
</script>

<svelte:head>
    <title>Dashboard | Administrador</title>
</svelte:head>

<div class="dashboard">

    <div class="welcome">

        <div>
            <h1>¡Bienvenido, Administrador! 👋</h1>

            <p>
                Desde este panel puedes administrar el contenido
                de Talking Hands.
            </p>
        </div>

    </div>

    <div class="cards">

        <a href="/admin/usuarios" class="card">

            <div class="icon">
                👥
            </div>

            <div>
                <h2>Usuarios</h2>
                <p>
                    Gestiona los usuarios de la plataforma.
                </p>
            </div>

        </a>

        <a href="/admin/modulos" class="card">

            <div class="icon">
                📚
            </div>

            <div>
                <h2>Módulos</h2>
                <p>
                    Administra los módulos de aprendizaje.
                </p>
            </div>

        </a>

        <a href="/admin/lecciones" class="card">

            <div class="icon">
                📖
            </div>

            <div>
                <h2>Lecciones</h2>
                <p>
                    Gestiona las lecciones de los módulos.
                </p>
            </div>

        </a>

        <a href="/admin/senas" class="card">

            <div class="icon">
                🤟
            </div>

            <div>
                <h2>Señas</h2>
                <p>
                    Administra el contenido de lengua de señas.
                </p>
            </div>

        </a>

    </div>

</div>

<style>
    .dashboard {
        max-width: 1200px;
        margin: 0 auto;
    }

    .welcome {
        position: relative;
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 25px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }

    /* Detalle sutil superior con los colores institucionales */
    .welcome::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #39A900 0%, #FC7314 100%);
    }

    h1 {
        margin: 0 0 8px;
        color: #1E293B; /* Gris Carbón */
        font-size: 28px;
        font-weight: 700;
    }

    .welcome p {
        margin: 0;
        color: #64748B;
        font-size: 15px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    .card {
        background: white;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 25px;
        display: flex;
        align-items: flex-start;
        gap: 20px;
        text-decoration: none;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(57, 169, 0, 0.12);
        border-color: rgba(57, 169, 0, 0.3);
    }

    .icon {
        font-size: 28px;
        min-width: 55px;
        height: 55px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F0FDF4; /* Tint Verde suave */
        border: 1px solid rgba(57, 169, 0, 0.15);
        border-radius: 10px;
        transition: background 0.25s ease, transform 0.25s ease;
    }

    .card:hover .icon {
        background: #39A900; /* Verde SENA */
        color: white;
        transform: scale(1.05);
    }

    .card h2 {
        margin: 0 0 7px;
        color: #1E293B; /* Gris Carbón */
        font-size: 19px;
        font-weight: 600;
        transition: color 0.2s ease;
    }

    .card:hover h2 {
        color: #39A900; /* Verde SENA */
    }

    .card p {
        margin: 0;
        color: #64748B;
        font-size: 14px;
        line-height: 1.5;
    }

    @media (max-width: 700px) {

        .cards {
            grid-template-columns: 1fr;
        }

    }
</style>