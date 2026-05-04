async function sendMessage() {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");
    const moduleSelect = document.getElementById("moduleSelect")?.value || "video";

    const text = input.value.trim();
    if (!text) return;

    // Affichage message user
    messages.innerHTML += `
        <div class="user">
            <div class="bubble">${escapeHtml(text)}</div>
        </div>
    `;

    input.value = "";

    // Loader
    const loadingId = "load_" + Date.now();

    messages.innerHTML += `
        <div id="${loadingId}" class="ai">
            <div class="bubble">🤖 YELOX réfléchit...</div>
        </div>
    `;

    try {
        const response = await fetch("https://TON-BACKEND.onrender.com/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: text,
                module: moduleSelect
            })
        });

        const data = await response.json();

        // Supprimer loader
        document.getElementById(loadingId)?.remove();

        const moduleConseil = genererConseil(moduleSelect);

        const finalText = `
            <strong>${moduleConseil.titre}</strong><br/><br/>
            <strong>1. IDÉES :</strong><br/>
            - ${data.result || "Action générée."}<br/><br/>
            <strong>2. ERREURS À ÉVITER :</strong><br/>
            - ${moduleConseil.erreur}
        `;

        messages.innerHTML += `
            <div class="ai">
                <div class="bubble">${finalText}</div>
            </div>
        `;

    } catch (error) {
        document.getElementById(loadingId)?.remove();

        messages.innerHTML += `
            <div class="ai">
                <div class="bubble">❌ Erreur serveur YELOX</div>
            </div>
        `;
    }

    // Scroll auto
    messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ==========================================
// L'écosystème des modules de YELOX Core
// ==========================================
const categoriesModules = {
    marketing: {
        titre: "MODULE : Marketing Digital",
        erreur: "Ne pas spammer les réseaux et mal cibler."
    },
    video: {
        titre: "MODULE : Scénario et Vidéo",
        erreur: "Accroche faible = perte d'audience."
    },
    musique: {
        titre: "MODULE : Production Musicale",
        erreur: "Problème de droits ou mauvaise qualité."
    },
    dev: {
        titre: "MODULE : Back-end & Dev",
        erreur: "Ne jamais exposer les clés API."
    },
    design: {
        titre: "MODULE : Infographie",
        erreur: "Visuels surchargés ou non lisibles."
    }
};

function genererConseil(categorie) {
    return categoriesModules[categorie] || categoriesModules["video"];
}