const postContent = document.querySelector("#post-content");
if(postContent){
  const postImages = postContent.getElementsByTagName('img');
  [...postImages].forEach(image=>{
    if(image.width<image.height){
      image.classList.add('portrait-image-js-added')
    }
  })
}
