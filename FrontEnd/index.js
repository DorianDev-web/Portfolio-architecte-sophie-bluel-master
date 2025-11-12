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

// Quand la page est chargée
document.addEventListener("DOMContentLoaded", async () => {
  const works = await getWorks(); // On récupère toutes les données
  displayWorks(works); // On affiche tout au début

  // Sélection des boutons
  const btnTous = document.querySelector("#btn-tous");
  const btnObjets = document.querySelector("#btn-objets");
  const btnAppartements = document.querySelector("#btn-appartements");
  const btnHotels = document.querySelector("#btn-hotels");

  // Tous les travaux
  btnTous.addEventListener("click", () => {
    displayWorks(works);
  });

  // Objets
  btnObjets.addEventListener("click", () => {
    const objets = works.filter(work => work.category.name === "Objets");
    displayWorks(objets);
  });

  // Appartements
  btnAppartements.addEventListener("click", () => {
    const appartements = works.filter(work => work.category.name === "Appartements");
    displayWorks(appartements);
  });

  // Hôtels & restaurants
  btnHotels.addEventListener("click", () => {
    const hotels = works.filter(work => work.category.name === "Hotels & restaurants");
    displayWorks(hotels);
  });
});
