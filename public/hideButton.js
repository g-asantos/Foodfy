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





