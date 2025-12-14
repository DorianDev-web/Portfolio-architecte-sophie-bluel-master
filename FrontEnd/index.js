// --- Fonction API : récupère les travaux ---
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

// Insert categories dans le select
function loadCategories(categories) {
    const select = document.getElementById("photo-category");
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected hidden></option>`;

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// Affiche les travaux dans la gallerie principale
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id;

        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

// DomContentLoaded

document.addEventListener("DOMContentLoaded", async () => {

    const works = await getWorks();
    const categories = await getCategories();

    displayWorks(works);

    // Filtres
    const filtersContainer = document.querySelector(".filters");
    filtersContainer.innerHTML = "";

    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn");
    btnAll.addEventListener("click", () => displayWorks(works));
    filtersContainer.appendChild(btnAll);

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");

        btn.addEventListener("click", () => {
            const filtered = works.filter(work => work.categoryId === category.id);
            displayWorks(filtered);
        });

        filtersContainer.appendChild(btn);
    });

    // Mode édition
    const tokenAtLoad = sessionStorage.getItem("token");
    const loginLink = document.getElementById("loginLink");

    if (tokenAtLoad) {
        document.querySelector(".projets").style.display = "flex";
        document.querySelector(".blackBar").style.display = "flex";
        filtersContainer.style.display = "none";

        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            window.location.reload();
        });
    }

    // Modale
    const modal = document.getElementById("modal");
    const modalGallery = document.getElementById("modal-gallery");
    const modalAdd = document.getElementById("modal-add-content");

    const btnModifier = document.getElementById("btn-modifier");
    const addPhotoBtn = document.querySelector(".add-photo-btn");

    const modalBody = document.querySelector(".modal-body");
    const modalAddBody = document.querySelector(".modal-body-content");

    const closeModal = document.getElementById("close-modal");
    const closeAdd = document.getElementById("close-gallery");
    const btnBack = document.getElementById("back-to-gallery");

    // Ouverture de la Modale avec check token
    btnModifier.addEventListener("click", async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté pour modifier.");
            return;
        }
        openModal();
    });

    window.openModal = async function () {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        modal.style.display = "flex";
        modalAdd.style.display = "none";
        modalGallery.style.display = "block";

        displayWorksInModal(await getWorks());
    };

    // Gallerie Modale
    function displayWorksInModal(works) {
        modalBody.innerHTML = "";

        works.forEach(work => {
            const div = document.createElement("div");
            div.classList.add("modal-item");
            div.dataset.id = work.id;

            div.innerHTML = `
                <img src="${work.imageUrl}">
                <button class="delete-btn" data-id="${work.id}">
                    <img src="./assets/images/Vector2.png">
                </button>
            `;

            modalBody.appendChild(div);
        });

        document.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", deleteWork)
        );
    }

    // Suppression des Images
    async function deleteWork(e) {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Session expirée.");
            return;
        }

        const id = e.currentTarget.dataset.id;

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            document.querySelector(`.modal-item[data-id="${id}"]`)?.remove();
            document.querySelector(`figure[data-id="${id}"]`)?.remove();
        }
    }

    // Ajout Photo
    addPhotoBtn.addEventListener("click", async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté pour ajouter.");
            return;
        }

        modalGallery.style.display = "none";
        modalAdd.style.display = "block";

        modalAddBody.innerHTML = `
            <div class="upload-box" id="upload-box">
                <img src="./assets/images/Vector3.png">
                <label class="upload-btn" for="image-input">+ Ajouter photo</label>
                <input id="image-input" type="file" accept="image/*" hidden>
                <p>jpg, png – 4mo max</p>
            </div>

            <label>Titre</label>
            <input type="text" id="photo-title">

            <label>Catégorie</label>
            <select id="photo-category"></select>
        `;

        loadCategories(await getCategories());

        const imageInput = document.getElementById("image-input");
        const titleInput = document.getElementById("photo-title");
        const categoryInput = document.getElementById("photo-category");
        const uploadBox = document.getElementById("upload-box");

        const btnActive = document.querySelector(".valider");
        const btnInactive = document.querySelector(".valider-inactive");

        btnActive.style.display = "none";
        btnInactive.style.display = "block";

        function checkForm() {
            const ok =
                imageInput.files.length > 0 &&
                titleInput.value.trim() !== "" &&
                categoryInput.value !== "";

            btnActive.style.display = ok ? "block" : "none";
            btnInactive.style.display = ok ? "none" : "block";
        }

        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (!file) return;

            uploadBox.innerHTML = "";
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.classList.add("preview-image");
            uploadBox.appendChild(img);

            checkForm();
        });

        titleInput.addEventListener("input", checkForm);
        categoryInput.addEventListener("change", checkForm);

        // Envoie du Formulaire
        btnActive.onclick = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("Session expirée.");
                return;
            }

            const formData = new FormData();
            formData.append("image", imageInput.files[0]);
            formData.append("title", titleInput.value);
            formData.append("category", categoryInput.value);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                displayWorks(await getWorks());
                displayWorksInModal(await getWorks());

                modalAdd.style.display = "none";
                modalGallery.style.display = "block";
            }
        };
    });

    // Navigation
    btnBack.onclick = () => {
        modalAdd.style.display = "none";
        modalGallery.style.display = "block";
    };

    closeModal.onclick = closeAdd.onclick = () => modal.style.display = "none";
    window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
});
