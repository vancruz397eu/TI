document.addEventListener('DOMContentLoaded', () => {
    // === 1. INYECCIÓN AUTOMÁTICA DEL BOTÓN MODO OSCURO ===
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dark-mode-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
        border-radius: 50%; border: none; cursor: pointer; font-size: 1.5rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 1000; transition: 0.3s;
        background: var(--pearl-white); color: var(--accent);
    `;
    document.body.appendChild(toggleBtn);

    // Comprobar estado guardado en el navegador
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        toggleBtn.innerHTML = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // === 2. INYECCIÓN AUTOMÁTICA DE BARRA DE BÚSQUEDA EN TIEMPO REAL ===
    const mainContent = document.querySelector('.content-grid');
    if (mainContent) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'grid-column: 1 / -1; width: 100%; max-width: 500px; margin: 0 auto 20px;';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Buscar conceptos (ej: IA, cuántica, gadgets)...';
        searchInput.style.cssText = `
            width: 100%; padding: 12px 20px; border-radius: 30px; 
            border: 1px solid var(--pearl-shadow); background: var(--pearl-white);
            box-sizing: border-box; font-size: 1rem; color: var(--text-main);
            outline: none; box-shadow: inset 2px 2px 5px var(--pearl-shadow);
        `;
        
        searchContainer.appendChild(searchInput);
        mainContent.parentNode.insertBefore(searchContainer, mainContent);

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const articles = document.querySelectorAll('article');

            articles.forEach(article => {
                const titleText = article.querySelector('.header-pill')?.innerText.toLowerCase() || '';
const paragraphsText = Array.from(article.querySelectorAll('p')).map(p => p.innerText.toLowerCase()).join(' ');
const text = titleText + ' ' + paragraphsText;

                if (text.includes(query)) {
                    article.style.display = 'block';
                    article.style.opacity = '1';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }

    // === 3. FUNCIÓN DE GUARDAR ARTÍCULOS COMO FAVORITOS ===
    document.querySelectorAll('article').forEach((article, index) => {
        // Crear contenedor para botones interactivos del artículo
        const actionArea = document.createElement('div');
        actionArea.style.cssText = 'margin-top: 20px; display: flex; gap: 15px;';

        // Identificador único basado en la URL y el índice del bloque
        const articleId = `${window.location.pathname}-art-${index}`;

        const favBtn = document.createElement('button');
        favBtn.style.cssText = 'background:transparent; border:none; cursor:pointer; font-size:1.2rem; transition:0.2s;';
        
        // Revisar si ya era favorito localmente
        let favorites = JSON.parse(localStorage.getItem('fav-articles')) || [];
        favBtn.innerHTML = favorites.includes(articleId) ? '❤️ Quitar Favorito' : '🤍 Guardar Favorito';

        favBtn.addEventListener('click', () => {
            favorites = JSON.parse(localStorage.getItem('fav-articles')) || [];
            if (favorites.includes(articleId)) {
                favorites = favorites.filter(id => id !== articleId);
                favBtn.innerHTML = '🤍 Guardar Favorito';
            } else {
                favorites.push(articleId);
                favBtn.innerHTML = '❤️ Quitar Favorito';
            }
            localStorage.setItem('fav-articles', JSON.stringify(favorites));
        });

        // === 4. CONTADOR DE REACCIONES ("ME GUSTA") ===
        const likeBtn = document.createElement('button');
        likeBtn.style.cssText = 'background:transparent; border:none; cursor:pointer; font-size:1rem; color: var(--accent); font-weight:600;';
        
        let likesCount = parseInt(localStorage.getItem(`likes-${articleId}`)) || 0;
        likeBtn.innerHTML = `👍 ${likesCount} Me gusta`;

        likeBtn.addEventListener('click', () => {
            likesCount++;
            localStorage.setItem(`likes-${articleId}`, likesCount);
            likeBtn.innerHTML = `👍 ${likesCount} Me gusta`;
            
            // Animación rápida de pulso
            likeBtn.style.transform = 'scale(1.2)';
            setTimeout(() => likeBtn.style.transform = 'scale(1)', 150);
        });

        actionArea.appendChild(favBtn);
        actionArea.appendChild(likeBtn);
        article.appendChild(actionArea);

        // === 5. EFECTO VISUAL DE SELECCIÓN SUAVE ===
        article.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        article.addEventListener('mouseenter', () => {
            article.style.transform = 'translateY(-5px)';
            article.style.boxShadow = '15px 15px 35px var(--pearl-shadow), -15px -15px 35px #ffffff';
        });
        article.addEventListener('mouseleave', () => {
            article.style.transform = 'translateY(0)';
            article.style.boxShadow = '10px 10px 25px var(--pearl-shadow), -10px -10px 25px #ffffff';
        });
    });
});
