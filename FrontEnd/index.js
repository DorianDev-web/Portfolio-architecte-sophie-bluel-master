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
    const categories = await getCategories();

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
    const token = sessionStorage.getItem("token");
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
            sessionStorage.removeItem("token");
            window.location.reload();
        });
    };
});

document.addEventListener("DOMContentLoaded", async () => {

    const token = sessionStorage.getItem("token");

    const modal = document.getElementById("modal");
    const btnModifier = document.getElementById("btn-modifier");
    const closeModal = document.getElementById("close-modal");
    const modalBody = document.querySelector(".modal-body");


    // Fonction : Construire la galerie
     function displayWorksInModal(works) {
        modalBody.innerHTML = ""; // reset

        works.forEach(work => {
            const item = document.createElement("div");
            item.classList.add("modal-item");
            item.dataset.id = work.id;

            item.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <button class="delete-btn" data-id="${work.id}">
                <img src="./assets/images/Vector2.png" alt="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            modalBody.appendChild(item);
        });

        // Ajout des événements pour chaque corbeille
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteWork);
        });
    }

    //  Fonction : Supprimer un work (API + DOM)
    async function deleteWork(e) {
        const workId = e.currentTarget.dataset.id;

        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {

            // Retirer dans la modale
            document.querySelector(`.modal-item[data-id="${workId}"]`)?.remove();

            // Retirer dans la galerie principale
            document.querySelector(`figure[data-id="${workId}"]`)?.remove();

        }
    }

    // OUVRIR la modale
    btnModifier.addEventListener("click", async () => {
        console.log("Bouton modifier cliqué");
        modal.style.display = "flex";

        const works = await getWorks();
        displayWorksInModal(works);
    });

    // FERMER avec le X
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // FERMER en cliquant sur le fond
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});





