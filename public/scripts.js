
const ImageGallery = {
	highlight: document.querySelector('.card__image-container .highlight > img'),
	previews: document.querySelectorAll('.filePreview img'),
	setImage(e) {
		const { target } = e


		ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
		target.classList.add('active')

		ImageGallery.highlight.src = target.src
	}
}


let headerButtons = document.querySelectorAll('header a, .header .headerContainer a, #adHead .admin_head a')

headerButtons.forEach(button => {



	let location = window.location.pathname.replace(/(\d)(\d)(\d).*$/, '')
	let finalUrl = `${window.location.protocol}//${window.location.hostname}:5000${location}`
  
	if (button.href == window.location.href) {
		button.classList.toggle('active')
	} else if (button.href == finalUrl) {
		button.classList.toggle('active')
	}

})









