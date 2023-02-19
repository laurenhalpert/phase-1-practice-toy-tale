let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys();

  function getToys() {
    fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(data => {
      for (let i =0; i < data.length; i++) {
        renderToy(data[i]);
      }
    })
  }

  function renderToy(data) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${data.name}</h2>
      <img class = "toy-avatar" src="${data.image}">
      <p id="like-count">
        ${data.likes} likes
      </p>
      <button class="like-btn" id=${data.id}>like</button>
    `
    
    let likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () =>{
      data.likes += 1;
      let p = card.querySelector("#like-count");
      p.innerText = `${data.likes} likes`;
      updateLikes(data);
    })


    function updateLikes(toyObj) {
      fetch(`http://localhost:3000/toys/${toyObj.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(toyObj) 
      })
      .then(resp => resp.json())
      .then(data => console.log(data.likes))

    }
    document.querySelector("#toy-collection").appendChild(card);
  }

  document.querySelector("form").addEventListener("submit", handleSubmit);
  function handleSubmit(event) {
    event.preventDefault();
    let toyNameInput = document.querySelectorAll(".input-text")[0];
    let imageInput = document.querySelectorAll(".input-text")[1];
    let toyObj = {
      name: toyNameInput.value,
      image: imageInput.value,
      likes: 0,
    }
    postNewToy(toyObj);
  }

  function postNewToy(toyObj) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toyObj)
    })
    .then(resp => resp.json())
    .then(data => renderToy(data))
  }

  });

  