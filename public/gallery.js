document.addEventListener('DOMContentLoaded', function() {
    const images = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image3.jpg'
    ];
    let currentIndex = 0;
    const carousel = document.getElementById('imageCarousel');
    const imgElement = carousel.querySelector('img');

    // Function to change images
    function changeImage() {
        imgElement.classList.add('blurry-load'); // Add blurry-load class for effect
        imgElement.src = images[currentIndex];  // Set low-res image first
        imgElement.dataset.src = images[currentIndex];  // Update data-src as well
        
        // Wait for the image to load before removing blur
        const highResImage = new Image();
        highResImage.src = images[currentIndex];
        highResImage.onload = () => {
            imgElement.src = highResImage.src;
            imgElement.classList.remove('blurry-load');
        };
        
        currentIndex = (currentIndex + 1) % images.length; // Update index for next image
    }

    // Initial image load
    changeImage();

    // Set interval to change image every 5 seconds
    setInterval(changeImage, 5000);
});
