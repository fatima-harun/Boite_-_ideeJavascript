/*prendre l'intégralité documentde la page HTML sur laquelle nous travaillons et écouter l'événement
 'DOMContentLoaded'qui se produit essentiellement lorsque l'ensemble du DOM a fini de se charger.
  Une fois cet événement entendu, il exécute ensuite le code que nous avons placé entre les accolades {}que j'ai commentées pour vous.*/
document.addEventListener('DOMContentLoaded', function() { 

  const containeridea = document.getElementById('containeridea');// faire apparaître nos livres
  const ideeURL = `http://localhost:3000/books`;/*constante pour l'URL de notre base de données de idees.
  lorsque nous utiliserons l'URL pour récupérer des données, nous n'aurons pas besoin de tout saisir !*/

  // Récupération des idées
  fetch(ideeURL) //extraire les données de ideeURL avec fetch
      .then(response => response.json()) //prenons les reponses de ideeURL(toutes les données de la base de données) et l'exécutons .json()
      .then(ideeData => {   
          let tableContent = ` /* initialisée pour créer une structure de table HTML, prête à être remplie avec les données des idées.  */
          <table class="table">
              <thead>
                  <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Titre</th>
                      <th scope="col">Catégorie</th>
                      <th scope="col">Description</th>
                      <th scope="col">Actions</th>
                  </tr>
              </thead>
              <tbody>
          `;

          // Remplissage de la table avec les données des idées
          ideeData.forEach(function(idee) { //forEach pour ajouter chaque idée à la table,
              tableContent += `
              <tr id="idee-${idee.id}">
                  <th scope="row">${idee.id}</th>
                  <td>${idee.titre}</td>
                  <td>${idee.categorie}</td>
                  <td>${idee.description}</td>
                  <td>
                      <button data-id="${idee.id}" id="approve-${idee.id}" data-action="approve" class="btn btn-success">Approuver</button>
                      <button data-id="${idee.id}" id="reject-${idee.id}" data-action="reject" class="btn btn-warning">Désapprouver</button>
                      <button data-id="${idee.id}" id="delete-${idee.id}" data-action="delete" class="btn btn-danger">Supprimer</button>
                  </td>
              </tr>
              `;
          });

          tableContent += `
              </tbody>
          </table>
          `;

          // Affichage du contenu de la table
          containeridea.innerHTML = tableContent;
      });

  const form = document.querySelector('form');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', (e) => { 
      e.preventDefault();
      
      const titreInput = form.querySelector('#titre').value;  
      const categorieInput = form.querySelector('#categorie').value; 
      const descriptionInput = form.querySelector('#description').value;

      let valid = true;

      // Vérification des champs avec regex
      const titleRegex = /^[a-zA-Z0-9\s]{3,50}$/; // Titre doit contenir entre 3 et 50 caractères alphanumériques
      const descriptionRegex = /^.{10,500}$/; // Description doit contenir entre 10 et 500 caractères

      if (!titleRegex.test(titreInput)) {
          document.getElementById('error-titre').innerText = 'Le titre est requis et doit contenir entre 3 et 50 caractères alphanumériques.';
          valid = false;
      } else {
          document.getElementById('error-titre').innerText = '';
      }

      if (!descriptionRegex.test(descriptionInput)) {
          document.getElementById('error-description').innerText = 'La description est requise et doit contenir entre 10 et 500 caractères.';
          valid = false;
      } else {
          document.getElementById('error-description').innerText = '';
      }

      if (valid) {
          fetch(ideeURL, {
              method: 'POST',
              body: JSON.stringify({ /* prend les données que nous y introduisons et les transforme 
                                         en données stringifiées, difficiles à lire pour les humains, mais plus faciles à lire pour JSON.*/
                 titre: titreInput,
                  categorie: categorieInput,
                  description: descriptionInput,
              }),
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(response => {
              if (response.ok) {
                  messageDiv.innerHTML = '<div class="alert alert-success">Idée ajoutée avec succès.</div>';
                  form.reset(); // Réinitialisation du formulaire après ajout
              } else {
                  return response.json().then(data => {
                      throw new Error(data.message || 'Erreur lors de l\'ajout de l\'idée.');
                  });
              }
          })
          .catch(error => {
              messageDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
          })
          .finally(() => {
              setTimeout(() => {
                  messageDiv.innerHTML = '';
              }, 2000);
          });
      } else {
          messageDiv.innerHTML = '<div class="alert alert-danger">Veuillez remplir tous les champs requis.</div>';
          setTimeout(() => {
              messageDiv.innerHTML = '';
          }, 2000);
      }
  });

  containeridea.addEventListener('click', (e) => { 
      if (e.target.dataset.action === 'approve' || e.target.dataset.action === 'reject') { 
          e.target.disabled = true;
      }

      if (e.target.dataset.action === 'delete') {
          const ideeId = e.target.dataset.id;
          document.getElementById(`idee-${ideeId}`).remove();
          fetch(`${ideeURL}/${ideeId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(() => {
              messageDiv.innerHTML = '<div class="alert alert-success">Idée supprimée avec succès.</div>';
              setTimeout(() => {
                  messageDiv.innerHTML = '';
              }, 2000);
          })
          .catch(error => {
              messageDiv.innerHTML = `<div class="alert alert-danger">Erreur lors de la suppression de l'idée.</div>`;
              setTimeout(() => {
                  messageDiv.innerHTML = '';
              }, 2000);
          });
      }
  });
});
