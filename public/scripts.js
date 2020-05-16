
 

const ImageGallery = {
  highlight: document.querySelector('.card__image-container .highlight > img'),
  previews: document.querySelectorAll('.filePreview img'),
  setImage(e){
    const { target } = e


    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
  }
}

const buttons = document.querySelectorAll('h5')
for (let button of buttons) {


  button.addEventListener('click', function () {
    if (button.innerHTML == 'MOSTRAR') {
      button.innerHTML = 'ESCONDER';
      button.nextElementSibling.classList.remove('show')

    } else if (button.innerHTML == 'ESCONDER') {
      button.innerHTML = 'MOSTRAR';
      button.nextElementSibling.classList.add('show')

    }


  })
}



function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  ingredients.appendChild(newField);
}



function addPrep() {
  const preps = document.querySelector("#preparation");
  const fieldContainer = document.querySelectorAll(".prepare");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  preps.appendChild(newField);
}


document.querySelector(".add-ingredient").addEventListener("click", addIngredient);


document.querySelector(".add-step").addEventListener("click", addPrep);


