// ==========================================================================
// CONTROL DEL MODO NOCHE (Toggle & LocalStorage)
// ==========================================================================
function inicializarModoNoche() {
    const botonToggle = document.getElementById('dark-mode-toggle');
    if (!botonToggle) return; // Si no encuentra el botón en la página actual, ignora la función

    // Al cargar la página, comprueba si el usuario ya tenía activo el Modo Noche previamente
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Escucha el click del botón para alternar los estilos y guardarlo en memoria del navegador
    botonToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==========================================================================
// EFECTO PARALLAX: Movimiento dinámico del fondo h1.png al hacer scroll
// ==========================================================================
window.addEventListener('scroll', () => {
    // Calculamos el desplazamiento actual de la ventana
    const despliegueTop = window.scrollY;
    
    // Multiplicamos por 0.4 para que el fondo se mueva más lento que el contenido (efecto de profundidad)
    const posicionFondoY = despliegueTop * 0.4;
    
    // Desplaza el fondo del body de forma nativa y fluida
    document.body.style.backgroundPositionY = `${posicionFondoY}px`;
});

// ==========================================================================
// DISPARADOR GLOBAL: Inicializa los componentes cuando el HTML está listo
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarModoNoche();
});
