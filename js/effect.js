document.addEventListener('DOMContentLoaded', function() {
    const flipButton = document.getElementById('flipButton');
    const backFlipButton = document.getElementById('backFlipButton');
    const flipCard = document.getElementById('flipCard');
    
    if (flipButton && flipCard) {
        flipButton.addEventListener('click', function(e) {
            e.preventDefault();
            flipCard.classList.add('flipped');
            // this.innerHTML = '<i class="bi bi-arrow-left me-2"></i>Back to image';
        });
    }
    
    if (backFlipButton && flipCard) {
        backFlipButton.addEventListener('click', function(e) {
            e.preventDefault();
            flipCard.classList.remove('flipped');
            // flipButton.innerHTML = '<i class="bi bi-arrow-right me-2"></i>About me';
        });
    }
});