// Fonction 1 : récupère les travaux depuis le back-end
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}

// Fonction 2 : affiche les travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // On vide la galerie avant d'afficher

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

document.addEventListener("DOMContentLoaded", async () => {
    const works = await getWorks(); // Récupère les travaux depuis l'API
    displayWorks(works); // Affiche tout au début

    const filtersContainer = document.querySelector(".filters");

    // Déclaration des filtres
    const filters = [
        { name: "Tous", category: "all" },
        { name: "Objets", category: "Objets" },
        { name: "Appartements", category: "Appartements" },
        { name: "Hôtels & restaurants", category: "Hotels & restaurants" }
    ];

    // Création des boutons
    filters.forEach(filter => {
        const btn = document.createElement("button");
        btn.textContent = filter.name;
        btn.classList.add("filter-btn");

        // Ajout de l'événement
        btn.addEventListener("click", () => {
            if (filter.category === "all") {
                displayWorks(works); // Tous les travaux
            } else {
                const filteredWorks = works.filter(
                    work => work.category.name === filter.category
                );
                displayWorks(filteredWorks);
            }
        });

        // On ajoute le bouton dans la div
        filtersContainer.appendChild(btn);
    });
});
