// On attend que la page soit totalement chargée avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {

  // On cible l'endroit dans le HTML où on veut afficher les projets
  const gallery = document.querySelector(".gallery");

  // Étape 1 : on fait une requête HTTP GET avec fetch()
  fetch("http://localhost:5678/api/works")

    // Étape 2 : on attend la réponse et on la convertit en JSON
    .then(response => {
      if (!response.ok) { // si le serveur renvoie une erreur HTTP
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json(); // on transforme le JSON brut en objet JS
    })

    // Étape 3 : on exploite les données reçues
    .then(data => {
      console.log("Travaux récupérés :", data); // pour vérifier dans la console

      // On vide d'abord la galerie (au cas où)
      gallery.innerHTML = "";

      // Pour chaque projet envoyé par le back-end, on crée du HTML
      data.forEach(work => {
        // on crée les éléments nécessaires
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const caption = document.createElement("figcaption");

        // on insère les infos du projet dedans
        img.src = work.imageUrl;     // lien de l’image
        img.alt = work.title;        // texte alternatif
        caption.textContent = work.title; // titre du projet

        // on assemble et on ajoute dans la galerie
        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
      });
    })

    // Étape 4 : on gère les erreurs (si le serveur ne répond pas par ex.)
    .catch(error => {
      console.error("Erreur lors du chargement des travaux :", error);
    });
});
