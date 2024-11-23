function testPassword() {
    const password = document.getElementById("password").value;

    // Comptage des types de caractères
    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const specialCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    const length = password.length;

    // Calcul de la taille du jeu de caractères
    let charsetSize = 0;
    if (lowercaseCount > 0) charsetSize += 26; // Lettres minuscules
    if (uppercaseCount > 0) charsetSize += 26; // Lettres majuscules
    if (numberCount > 0) charsetSize += 10;   // Chiffres
    if (specialCount > 0) charsetSize += 32;  // Caractères spéciaux

    // Calcul de l'entropie
    const entropy = charsetSize > 0 ? Math.round(length * Math.log2(charsetSize)) : 0;

    // Mise à jour des critères dans la page
    document.getElementById("length").textContent = length;
    document.getElementById("lowercase").textContent = lowercaseCount;
    document.getElementById("uppercase").textContent = uppercaseCount;
    document.getElementById("numbers").textContent = numberCount;
    document.getElementById("special").textContent = specialCount;
    document.getElementById("entropy").textContent = entropy;

    // Vérification du mot de passe par rapport au fichier txt
    checkPasswordInTxt(password).then(isInFile => {
        let strength = "Faible";
        let alertMessage = '';

        if (isInFile) {
            alertMessage = "Votre mot de passe se trouve dans une liste de mots connus. Utilisez un mot de passe plus complexe.";
        }

        if (entropy >= 80 && !isInFile) {
            strength = "Légendaire";
        } else if (entropy >= 60 && !isInFile) {
            strength = "Fort";
        } else if (entropy >= 40 && !isInFile) {
            strength = "Moyen";
        } else {
            strength = "Faible";
        }

        // Mise à jour de la force du mot de passe
        const resultElement = document.getElementById("strength");
        resultElement.textContent = strength;
        resultElement.style.color =
            strength === "Légendaire"
                ? "green"
                : strength === "Fort"
                    ? "blue"
                    : strength === "Moyen"
                        ? "orange"
                        : "red";

        // Affichage de l'alerte si le mot de passe est faible ou connu
        const passwordAlert = document.getElementById("passwordAlert");
        if (alertMessage) {
            passwordAlert.style.display = 'block';
            passwordAlert.querySelector('p').textContent = alertMessage;
        } else {
            passwordAlert.style.display = 'none';
        }
    });
}

// Vérifier si le mot de passe existe dans le fichier txt
function checkPasswordInTxt(password) {
    return fetch('static/password.txt')
        .then(response => response.text())
        .then(data => {
            const words = data.split('\n').map(word => word.trim());
            return words.includes(password.trim());
        })
        .catch(() => {
            console.error("Erreur lors du chargement du fichier");
            return false;
        });
}

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Bascule entre 'password' et 'text'
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Change l'icône en fonction de l'état
    this.textContent = type === 'password' ? '👁️' : '🐝';
});

function generatePassword() {
    const length = parseInt(document.getElementById("passwordLength").value);
    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSpecial = document.getElementById("includeSpecial").checked;

    // Caractères disponibles
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";

    let charset = "";
    if (includeLowercase) charset += lowercaseChars;
    if (includeUppercase) charset += uppercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSpecial) charset += specialChars;

    if (!charset) {
        alert("Veuillez sélectionner au moins une option de caractère !");
        return;
    }

    // Génération du mot de passe
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Calcul de l'entropie
    const charsetSize = charset.length;
    const entropy = charsetSize > 0 ? Math.round(length * Math.log2(charsetSize)) : 0;

    // Mise à jour des résultats dans la page
    document.getElementById("generatedPassword").textContent = password;
    document.getElementById("generatedEntropy").textContent = entropy;

    // Tester la force du mot de passe généré
    document.getElementById("password").value = password;
    testPassword();
}
