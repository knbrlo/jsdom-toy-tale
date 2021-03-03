let addToy = false;
let toyForm = document.querySelector(".add-toy-form");

document.addEventListener("DOMContentLoaded", () => {

  getToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");



  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";

      // if we're adding a toy then get ready to handle events
      toyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addNewToy();
      })

    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function getToys() {
  return fetch('http://localhost:3000/toys')
         .then(function(response) {
           return response.json();
         })
         .then(function(object) {
           makeCardsFromData(object);
         })
         .catch(function(error) {
          console.log(error.message);
         })
}

function makeCardsFromData(arrayOfToys) {
  let toyCollectionElement = document.getElementById('toy-collection');
  for (const toy of arrayOfToys) {
    let newCard = document.createElement('div');
    newCard.className = "card";
    newCard.innerHTML = 
    `
      <h2 id="toy-id-${toy.id}">${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button type="button" class="like-btn">Like <3</button>
    `
    toyCollectionElement.appendChild(newCard);
  }
  addListenersToLikeButtons();
}

function addNewToy() { 
  let inputFields = document.querySelectorAll(".input-text");
  let newName = "";
  let newImage = "";

  for (let t = 0; t < inputFields.length; t++) {

    if (inputFields[t].name == "name") {
      newName = inputFields[t].value;
    }

    if (inputFields[t].name == "image") {
      newImage = inputFields[t].value;
    }

  }

  let formData = {
    name: newName,
    image: newImage,
    likes: 0
  }

  let configObj = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify(formData)
  };

  fetch("http://localhost:3000/toys", configObj) 
  .then(function(response) {
      return response.json();
  })
  .then(function(object) {
      let responseID = object["id"];
      console.log(responseID);
  })
  .catch(function(error) {
      console.log(error.message);
  });

}

function addListenersToLikeButtons() {
  let likeButtons = document.querySelectorAll(".like-btn");
  for (let y = 0; y < likeButtons.length; y++) {
    likeButtons[y].addEventListener('click', function(e) {
      e.preventDefault();
      findToyAndLikeIt(likeButtons[y]);
    })
  }
}

function findToyAndLikeIt(elementClicked) {
  let parent = elementClicked.parentElement;

  // get current likes
  let currenLikesText = parent.querySelector("p");
  let currentLikesNumber = currenLikesText.innerHTML;
  let splitLikeText = currentLikesNumber.split(" ");
  let actualLikeNumber = splitLikeText[0];

  // increase the like number
  let newLikeCount = parseInt(actualLikeNumber) + 1;

  // increase the like count on the page without refreshing.
  let newLikeString = "";
  if (newLikeCount == 1) {
    newLikeString =  `${newLikeCount}` + " Like"
  } else {
    newLikeString =  `${newLikeCount}` + " Likes"
  }
  currenLikesText.innerHTML = newLikeString;

  // get id of toy
  let toyClicked = parent.querySelector('h2');
  let splitToyId = toyClicked.id.split('-');
  let actualIdNumber = splitToyId[splitToyId.length - 1];
 
  let configObj = {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikeCount
    })
  };
  let customURL = `http://localhost:3000/toys/${actualIdNumber}`
  fetch(customURL, configObj) 
}
