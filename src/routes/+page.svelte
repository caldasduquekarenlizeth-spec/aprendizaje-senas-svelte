<svelte:head>
	<title>Aprendizaje de Señas</title>
	<meta
		name="description"
		content="Plataforma interactiva para aprender lengua de señas."
	/>
</svelte:head>

<div class="pagina-inicio">

	<header class="encabezado">
		<div class="marca">
			<img src="/logo_th.svg" alt="Logo Aprendizaje de Señas" class="logo" />
			<span>Aprendizaje de Señas</span>
		</div>

		<nav>
			<a href="/login" class="enlace-login">Iniciar sesión</a>
			<a href="/registro" class="boton-registro">Registrarse</a>
		</nav>
	</header>

	<section class="hero">
		<div class="hero-contenido">

			<div class="hero-texto">
				<p class="etiqueta">APRENDE · PRACTICA · COMUNÍCATE</p>

				<h1>
					Aprende lengua de señas
					<span>de una manera sencilla.</span>
				</h1>

				<p class="descripcion">
					Una plataforma diseñada para aprender y practicar lengua de
					señas mediante módulos y actividades interactivas.
				</p>

				<div class="acciones">
					<a href="/registro" class="boton-principal">
						Crear una cuenta
					</a>

					<a href="/login" class="boton-secundario">
						Ya tengo una cuenta
					</a>
				</div>
			</div>

			<div class="hero-logo">
				<div class="circulo-logo">
					<img
						src="/logo_th.svg"
						alt="Aprendizaje de Señas"
					/>
				</div>
			</div>

		</div>
	</section>

	<section class="informacion">
		<h2>¿Qué encontrarás?</h2>

		<p class="subtitulo">
			Empieza tu proceso de aprendizaje y avanza a tu propio ritmo.
		</p>

		<div class="tarjetas">

			<div class="tarjeta">
				<div class="icono">📚</div>
				<h3>Módulos de aprendizaje</h3>
				<p>
					Explora diferentes módulos organizados para facilitar
					el aprendizaje paso a paso.
				</p>
			</div>

			<div class="tarjeta">
				<div class="icono">🤟</div>
				<h3>Aprende nuevas señas</h3>
				<p>
					Conoce y practica diferentes señas para ampliar
					tu vocabulario.
				</p>
			</div>

			<div class="tarjeta">
				<div class="icono">🎯</div>
				<h3>Practica</h3>
				<p>
					Refuerza tus conocimientos mediante actividades
					y ejercicios interactivos.
				</p>
			</div>

		</div>
	</section>

	<footer>
		<p>© 2026 Aprendizaje de Señas</p>
	</footer>

</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f4f6f8; /* Fondo Gris Calmo */
		color: #1e293b; /* Gris Carbón */
	}

	.pagina-inicio {
		min-height: 100vh;
	}

	.encabezado {
		position: absolute;
		width: 100%;
		box-sizing: border-box;
		padding: 15px 7%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #ffffff;
		border-bottom: 1px solid #e2e8f0;
		z-index: 50;
	}

	.marca {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 20px;
		font-weight: bold;
		color: #1e293b;
	}

	.logo {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	nav a {
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.enlace-login {
		color: #39a900; /* Verde SENA */
	}

	.enlace-login:hover {
		color: #319200;
	}

	.boton-registro {
		background: #39a900; /* Verde SENA */
		color: white;
		padding: 10px 20px;
		border-radius: 8px;
	}

	.boton-registro:hover {
		background: #319200;
	}

	.hero {
		padding: 80px 7%;
		background: linear-gradient(135deg, #f4f6f8 0%, #ffffff 100%);
	}

	.hero-contenido {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 60px;
	}

	.hero-texto {
		max-width: 650px;
	}

	.etiqueta {
		color: #fc7314; /* Naranja Cálido */
		font-size: 14px;
		font-weight: bold;
		letter-spacing: 1.5px;
	}

	h1 {
		font-size: 48px;
		line-height: 1.1;
		margin: 15px 0;
		color: #1e293b;
	}

	h1 span {
		display: block;
		color: #39a900; /* Verde SENA */
	}

	.descripcion {
		font-size: 18px;
		line-height: 1.7;
		color: #64748b;
		max-width: 600px;
	}

	.acciones {
		display: flex;
		gap: 15px;
		margin-top: 30px;
	}

	.acciones a {
		text-decoration: none;
		padding: 14px 24px;
		border-radius: 8px;
		font-weight: bold;
		transition: all 0.2s ease;
	}

	.boton-principal {
		background: #39a900; /* Verde SENA */
		color: white;
		box-shadow: 0 4px 12px rgba(57, 169, 0, 0.2);
	}

	.boton-principal:hover {
		background: #319200;
	}

	.boton-secundario {
		border: 2px solid #39a900;
		color: #39a900;
		background: white;
	}

	.boton-secundario:hover {
		background: #f0fdf4;
	}

	.acciones a:hover {
		transform: translateY(-2px);
	}

	.hero-logo {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.circulo-logo {
		position:relative;
		width: 280px;
		height: 280px;
		border-radius: 50%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #e2e8f0;
		box-shadow: 0 15px 40px rgba(57, 169, 0, 0.12); /* Sombra tenue verde */
	}

	.circulo-logo img {
		width: 100%;
		height: 100%;
		object-fit:cover;
	}

	.informacion {
		max-width: 1100px;
		margin: 0 auto;
		padding: 70px 7%;
		text-align: center;
	}

	.informacion h2 {
		font-size: 32px;
		margin-bottom: 10px;
		color: #1e293b;
	}

	.subtitulo {
		color: #64748b;
		margin-bottom: 40px;
	}

	.tarjetas {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 25px;
	}

	.tarjeta {
		position: relative;
		background: white;
		padding: 30px;
		border-radius: 15px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
	}

	/* Detalle sutil en hover en las tarjetas con el gradiente de la paleta */
	.tarjeta::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, #39a900 0%, #fc7314 100%);
		opacity: 0.3;
		transition: opacity 0.3s ease;
	}

	.tarjeta:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 25px rgba(57, 169, 0, 0.12);
		border-color: rgba(57, 169, 0, 0.3);
	}

	.tarjeta:hover::before {
		opacity: 1;
	}

	.icono {
		font-size: 38px;
		margin-bottom: 15px;
	}

	.tarjeta h3 {
		margin-bottom: 10px;
		color: #1e293b;
	}

	.tarjeta p {
		color: #64748b;
		line-height: 1.6;
	}

	footer {
		text-align: center;
		padding: 25px;
		background: #1e293b; /* Gris Carbón */
		color: white;
	}

	@media (max-width: 768px) {
		.encabezado {
			padding: 15px 5%;
		}

		.marca span {
			display: none;
		}

		.hero {
			padding: 50px 5%;
		}

		.hero-contenido {
			flex-direction: column;
			text-align: center;
		}

		h1 {
			font-size: 38px;
		}

		.descripcion {
			margin: 0 auto;
		}

		.acciones {
			justify-content: center;
			flex-direction: column;
		}

		.circulo-logo {
			width: 220px;
			height: 220px;
		}

		.tarjetas {
			grid-template-columns: 1fr;
		}
	}
</style>