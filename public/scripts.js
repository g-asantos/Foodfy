
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

