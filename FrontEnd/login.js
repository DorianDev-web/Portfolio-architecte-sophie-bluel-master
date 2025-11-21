document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Empêche la page de se recharger

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                document.getElementById("error").textContent = "Email ou mot de passe incorrect";
                return;
            }

            // Token reçu → on le stocke
            localStorage.setItem("token", data.token);

            // Redirection vers la page admin ou index
            window.location.href = "index.html";
        }
        catch (error) {
            document.getElementById("error").textContent = "Erreur serveur";
        }
    });
});
