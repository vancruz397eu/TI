// Credenciales de conexión a tu base de datos de Supabase
const SUPABASE_URL = "https://lzhcjxvgiltnqgpllbzu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3iZ49a_T7eRe6R6aVusyYg_WcemwG6S";

// Función automática para detectar la página actual y renderizar las tarjetas
async function cargarTarjetasDinamicas() {
    const contenedor = document.querySelector('.content-grid');
    if (!contenedor) return; // Detiene el script si no encuentra el contenedor .content-grid

    // Detectamos en qué archivo HTML está el usuario para filtrar en la base de datos
    let paginaActual = window.location.pathname.split("/").pop();
    
    // Si la URL está limpia o es la raíz, asumimos que es index.html
    if (paginaActual === "" || paginaActual === "index.html") {
        paginaActual = "inicio";
    } else {
        paginaActual = paginaActual.replace(".html", ""); // Quita el '.html' (ej: 'ai.html' -> 'ai')
    }

    try {
        // Hacemos la consulta filtrando por la sección correspondiente
        const urlConsulta = `${SUPABASE_URL}/rest/v1/tarjetas?seccion=eq.${paginaActual}&select=*`;
        const respuesta = await fetch(urlConsulta, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!respuesta.ok) throw new Error("Error al conectar con Supabase");
        const datos = await respuesta.json();

        // Si hay información en la base de datos, limpiamos el HTML fijo y ponemos los datos dinámicos
        if (datos.length > 0) {
            contenedor.innerHTML = ""; 
            
            datos.forEach(tarjeta => {
                // Comprobamos si tiene un segundo párrafo para no mostrar un espacio en blanco roto
                const parrafoDosHTML = tarjeta.parrafo_dos ? `<p>${tarjeta.parrafo_dos}</p>` : '';
                
                const estructuraTarjeta = `
                    <article>
                        <div class="header-pill"><h4>${tarjeta.titulo}</h4></div>
                        <p>${tarjeta.parrafo_uno}</p>
                        ${parrafoDosHTML}
                    </article>
                `;
                contenedor.innerHTML += estructuraTarjeta;
            });
        }

    } catch (error) {
        console.error("Hubo un error cargando las tarjetas:", error);
    }
}

// Escuchamos el evento cuando el HTML termina de cargar en el navegador
document.addEventListener("DOMContentLoaded", cargarTarjetasDinamicas);
