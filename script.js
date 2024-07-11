document.addEventListener('DOMContentLoaded', function() { 

    //fonctionnalite pour lire et afficher une idee

    // creation d'une variable pour le conteneur de nos idees
    const containeridea = document.getElementById('containeridea')

     //creation d'une contante pour l'url de notre base de donnee
       const ideeURL = ` http://localhost:3000/books`
       
       //recuperation de l'ensemble des idees avec fetch pour extraire les données de ideeURL
       fetch(`${ideeURL}`) 

     //prenons le response from ideeURL(toutes les données de la base de données) et l'exécutons .json(). 
    .then( response => response.json() ) 

    //nous appelons cette réponse désormais lisible par l'homme et l'appelons ideeData.Nous exécutons ensuite a forEachsur ideeData, qui exécutera a function sur chaque  idee dans ideeData.
    .then( ideeData => ideeData.forEach(function(idee) { 
        //on recupère chaque propriete de idee ou chaque colonne de idee
      containeridea.innerHTML += ` 
      <div id=${idee.id}> 
        <h2>${idee.titre}</h2> 
        <h4>Categorie : ${idee.categorie}</h4> 
        <p>${idee.description}</p> 
        <button data-id="${idee.id}" id="edit-${idee.id}" data-action="edit">Modifier</button> 
        <button data-id="${idee.id}" id="delete-${idee.id}" data-action="delete">Supprimer</button> 
      </div>` 
    })) // fin de la récupération de l'idee


    //fonctionnalite pour creer une idee

    //créons une constante pour le formulaire de l'idee, qui est ce que nous allons manipuler afin d'ajouter notre entrée à la base de données
    const form = document.querySelector('form')
     
    //'écouter un événement appelé ‘submit’sur formulaire declarer avec la variable const form.Submit se trouve sur le bouton Ajouter une idee
    form.addEventListener('submit', (e) => { 
        e.preventDefault() //e.preventDefault()empêche ce bouton d'actualiser automatiquement la page,
        
        // creer une constante pour chaque attribut ajouter à l'idee.Ces constantes sélectionnent leurs clés respectives dans form, et renvoient leur valeur avec .value
        const titreInput = form.querySelector('#titre').value  
        const categorieInput = form.querySelector('#categorie').value 
       const descriptionInput = form.querySelector('#description').value

       //ajouter une nouvelle fetchrequête qui sera envoyée POSTà la base de données avec nos nouvelles données 
       fetch(`${ideeURL}`, {
        method: 'POST',
        body: JSON.stringify({
          titre: titreInput,
          categorie:categorieInput,
          description: descriptionInput,
        }),
        headers: {
          'Content-Type': 'application/json' //on est pas obligé de l'utiliser mais il est nécessaire pour que le fetch et le fontionnement du système soit fait
        }
      })
   })//fin pour la fonctionalite create

   //fonctionnalite update
   containeridea.addEventListener('click', (e) => { 
    if (e.target.dataset.action === 'edit') { 
      console.log('you pressing edit') 
    } else if (e.target.dataset.action === 'delete') { 
      console.log('you pressing delete') 
    } 
  }) // fin de l'eventListener pour l'édition et la suppression d'un livre
 })