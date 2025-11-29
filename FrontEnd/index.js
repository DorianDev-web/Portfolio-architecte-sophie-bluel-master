// --- Fonction 1 : récupère les travaux ---
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

function loadCategories(categories) {
    const select = document.getElementById("photo-category");
    select.innerHTML = `<option value="" disabled selected hidden></option>`;

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
};

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

    // ---- Sélecteurs ----
    const modal = document.getElementById("modal");
    const modalGallery = document.getElementById("modal-gallery");
    const modalAdd = document.getElementById("modal-add-content");

    const addPhotoBtn = document.querySelector(".add-photo-btn");
    const btnModifier = document.getElementById("btn-modifier");

    const closeGallery = document.getElementById("close-modal");
    const closeAdd = document.getElementById("close-gallery");
    const btnBack = document.getElementById("back-to-gallery");

    const modalBody = document.querySelector(".modal-body");
    const modalAddBody = document.querySelector(".modal-body-content");

    // Ouvrir la modale Gallerie
    window.openModal = async function () {
        modal.style.display = "flex";
        modalGallery.style.display = "block";
        modalAdd.style.display = "none";

        const works = await getWorks();
        displayWorksInModal(works);
    };

    btnModifier.addEventListener("click", openModal);


    // Afficher les Works dans la modale
    function displayWorksInModal(works) {
        modalBody.innerHTML = "";

        works.forEach(work => {
            const item = document.createElement("div");
            item.classList.add("modal-item");
            item.dataset.id = work.id;

            item.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <button class="delete-btn" data-id="${work.id}">
                    <img src="./assets/images/Vector2.png" alt="delete">
                </button>
            `;

            modalBody.appendChild(item);
        });

        document.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", deleteWork)
        );
    }


    // Supprimer un work
    async function deleteWork(e) {
        const id = e.currentTarget.dataset.id;

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            document.querySelector(`.modal-item[data-id="${id}"]`)?.remove();
            document.querySelector(`figure[data-id="${id}"]`)?.remove();
        }
    }


    // Ouvrir la modale photo
    addPhotoBtn.addEventListener("click", async () => {
        modalGallery.style.display = "none";
        modalAdd.style.display = "block";

        modalAddBody.innerHTML = `
            <div class="upload-box">
                <img src="./assets/images/Vector3.png">
                <label for="image-input" class="upload-btn">+ Ajouter photo</label>
                <input type="file" id="image-input" accept="image/*" hidden>
                <p>jpg, png – 4mo max</p>
            </div>

            <label>Titre</label>
            <input type="text" id="photo-title">

            <label>Catégorie</label>
            <select id="photo-category"></select>
        `;

        // Insert categories
        const categories = await getCategories();
        loadCategories(categories);
    });

    // Retour à la Gallerie
    btnBack.addEventListener("click", () => {
        modalAdd.style.display = "none";
        modalGallery.style.display = "block";
    });

    // Fermeture de la Modale
    closeGallery.addEventListener("click", () => {
        modal.style.display = "none";
    });
    closeAdd.addEventListener("click", () => {
        modal.style.display = "none"
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
});





