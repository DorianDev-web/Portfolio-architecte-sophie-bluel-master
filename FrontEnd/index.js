// Déclaration de la fonction
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data; // on retourne les données pour les réutiliser
}

document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.querySelector(".gallery");

  // On vide la galerie
  gallery.innerHTML = "";

  try {
    // On récupère les données depuis le back-end
    const data = await getWorks();

    // Pour chaque projet, on crée le HTML
    data.forEach(work => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const caption = document.createElement("figcaption");

      img.src = work.imageUrl; // lien de l'image
      img.alt = work.title; // texte alternatif
      caption.textContent = work.title; // titre du projet

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  }
});
