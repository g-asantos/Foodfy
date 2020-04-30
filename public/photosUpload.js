const PhotosUpload = {
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],
  input: '',
  handleFileInput(event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target
    if(PhotosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      
      PhotosUpload.files.push(file)
      
      const reader = new FileReader()


      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)
        const div = PhotosUpload.getContainer(image)
        

        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)




    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()




  },
  getContainer(image){
    const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  hasLimit(event){
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo'){
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length

    if(totalPhotos > uploadLimit){
      alert('Você atingiu o limite máximo de fotos')
      event.preventDefault()
      return true
    }

    return false
  },
  getRemoveButton(){
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },
  removePhoto(event){
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)




    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
    photoDiv.remove()

  },
  removeOldPhoto(event){
    const photoDiv = event.target.parentNode

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]')
      
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`
      }
    }



    photoDiv.remove()
  }



}

const chefsPhotosUpload = {
  preview: document.querySelector('#photos-chef-preview'),
  uploadLimit: 1,
  files: [],
  input: '',
  handleFileInput(event) {
    const { files: fileList } = event.target
    chefsPhotosUpload.input = event.target
    if(chefsPhotosUpload.hasLimit(event)) return
    
    
    Array.from(fileList).forEach(file => {
      
      chefsPhotosUpload.files.push(file)
      
      const reader = new FileReader()


      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)
        const div = chefsPhotosUpload.getContainer(image)
        

        chefsPhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)




    })

    chefsPhotosUpload.input.files = chefsPhotosUpload.getAllFiles()




  },
  getContainer(image){
    const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = chefsPhotosUpload.removePhoto

        div.appendChild(image)
        
        div.appendChild(chefsPhotosUpload.getRemoveButton())

        return div
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    chefsPhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  hasLimit(event){
    const { uploadLimit, input, preview } = chefsPhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo'){
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length

    if(totalPhotos > uploadLimit){
      alert('Você atingiu o limite máximo de fotos')
      event.preventDefault()
      return true
    }

    return false
  },
  getRemoveButton(){
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },
  removePhoto(event){
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(chefsPhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)




    chefsPhotosUpload.files.splice(index, 1)
    chefsPhotosUpload.input.files = PhotosUpload.getAllFiles()
    photoDiv.remove()

  },
  removeOldPhoto(event){
    const photoDiv = event.target.parentNode

    if(photoDiv.id){
      const removedFiles = document.querySelector('input[name="removed_files"]')
      
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`
      }
    }



    photoDiv.remove()
  }



}

