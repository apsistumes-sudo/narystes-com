function loadImage(src, i, onLoad) {
  return new Promise((resolve, reject) => {
    if (typeof src === 'string') {
      src = { name: 'image' + i, src };
    }
    let img = new Image();
    src.img = img;
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', (event) => {
      if (typeof onLoad === 'function') onLoad.call(null, img, i);
      resolve(src);
    });
    img.addEventListener('error', reject);
    // src.src can be a plain string or a Next.js StaticImageData object
    const url = typeof src.src === 'string' ? src.src : src.src.src;
    img.src = url;
  });
}

function loadImages(images, onLoad) {
  return Promise.all(images.map((src, i) => loadImage(src, i, onLoad)));
}

export default function ImageLoader(images, onLoad) {
  return new Promise((resolve, reject) => {
    loadImages(images, onLoad).then((loadedImages) => {
      let r = {};
      loadedImages.forEach((curImage) => {
        r[curImage.name] = { img: curImage.img, src: curImage.src };
      });
      resolve(r);
    }).catch(reject);
  });
}
