document.addEventListener('DOMContentLoaded', function () {
  // Récupérer les idées du local storage
  const storedIdees = JSON.parse(localStorage.getItem('idees')) || [];
  afficherIdees(storedIdees);
});

document.querySelector('.submit').addEventListener('click', function (event) {
  event.preventDefault();

  // Récupérer les valeurs des champs
  const titre = document.getElementById('titre').value;
  const categorie = document.getElementById('categorie').value;
  const description = document.getElementById('description').value;

  // Effacer les messages d'erreur précédents
  document.querySelectorAll('#myform .error').forEach(function (element) {
      element.innerText = '';
  });

  let isValid = true;

  // Valider le titre
  if (titre.trim() === '') {
      document.querySelector('#titre + span').innerText = 'Le titre est requis.';
      isValid = false;
  }

  // Valider la catégorie
  if (categorie === 'Selectionner') {
      document.querySelector('#categorie + span').innerText = 'Veuillez sélectionner une catégorie.';
      isValid = false;
  }

  // Valider la description
  if (description.trim() === '') {
      document.querySelector('#description + span').innerText = 'La description est requise.';
      isValid = false;
  }

  // Si toutes les validations sont passées
  if (isValid) {
      // Récupérer les idées existantes du local storage
      let idees = JSON.parse(localStorage.getItem('idees')) || [];

      // Ajouter la nouvelle idée au tableau
      const nouvelleIdee = {
          titre: titre,
          categorie: categorie,
          description: description,
          status: '' // 'approuvé' ou 'désapprouvé'
      };
      idees.push(nouvelleIdee);

      // Enregistrer le tableau mis à jour dans le local storage
      localStorage.setItem('idees', JSON.stringify(idees));

      // Afficher les idées mises à jour
      afficherIdees(idees);

      // Réinitialiser le formulaire
      document.getElementById('myform').reset();
  }
});

function afficherIdees(idees) {
  const cardContainer = document.getElementById('card');
  cardContainer.innerHTML = ''; // Effacer le contenu précédent

  idees.forEach((idee, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
          <h3>${idee.titre}</h3>
          <p>Catégorie: ${idee.categorie}</p>
          <p>${idee.description}</p>
          <button class="approve" onclick="approuverIdee(${index})">Approuver</button>
          <button class="disapprove" onclick="desapprouverIdee(${index})">Désapprouver</button>
          <button onclick="supprimerIdee(${index})">Supprimer</button>
      `;
      if (idee.status === 'approuvé') {
          card.style.backgroundColor = '#2ecc71';
          card.style.color = 'white';
          card.querySelector('.disapprove').style.display = 'none';
      } else if (idee.status === 'désapprouvé') {
          card.style.backgroundColor = 'red';
          card.style.color = 'white';
          card.querySelector('.approve').style.display = 'none';
      }
      cardContainer.appendChild(card);
  });
}

function approuverIdee(index) {
  let idees = JSON.parse(localStorage.getItem('idees')) || [];
  idees[index].status = 'approuvé';
  localStorage.setItem('idees', JSON.stringify(idees));
  afficherIdees(idees);
}

function desapprouverIdee(index) {
  let idees = JSON.parse(localStorage.getItem('idees')) || [];
  idees[index].status = 'désapprouvé';
  localStorage.setItem('idees', JSON.stringify(idees));
  afficherIdees(idees);
}

function supprimerIdee(index) {
  let idees = JSON.parse(localStorage.getItem('idees')) || [];
  idees.splice(index, 1);
  localStorage.setItem('idees', JSON.stringify(idees));
  afficherIdees(idees);
}
