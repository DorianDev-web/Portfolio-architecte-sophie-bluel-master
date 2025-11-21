// --- Fonction 1 : récupère les travaux ---
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

// --- Fonction 2 : affiche les travaux ---
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// --- Quand la page est prête ---
document.addEventListener("DOMContentLoaded", async () => {

    // 1 Récupération API
    const works = await getWorks();
    const categories = await fetch("http://localhost:5678/api/categories")
                            .then(res => res.json());

    // 2️ Affichage initial : Tous les projets
    displayWorks(works);

    // 3️ Création des filtres directement ici (Option A)
    const filtersContainer = document.querySelector(".filters");
    filtersContainer.innerHTML = "";

    //  Bouton Tous
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn");
    btnAll.addEventListener("click", () => displayWorks(works));
    filtersContainer.appendChild(btnAll);

    // Les boutons catégories venant de l’API
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");

        btn.addEventListener("click", () => {
            const filtered = works.filter(
                work => work.categoryId === category.id
            );
            displayWorks(filtered);
        });

        filtersContainer.appendChild(btn);
    });

    // 4️ Gestion Login / Logout
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");

    if (token) {
        // Réapparition de la div "modifier"
        const div = document.querySelector(".projets");
        div.style.display = "flex";

        // Réapparition de la barre noire
        const bar = document.querySelector(".blackBar");
        bar.style.display = "flex";

        // masquer les filtres
        filtersContainer.style.display = "none";

        loginLink.textContent = "logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }
});



