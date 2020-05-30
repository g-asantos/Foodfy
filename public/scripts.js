


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


const images = document.querySelectorAll('img')

for(let i = 0; i < images.length; i++){
  
  let newImages = images[i].src.replace(/public/i, '')
  
  

  images[i].src = newImages
}

