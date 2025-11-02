// Lightbox navigation with arrow keys - continuous looping
document.addEventListener('DOMContentLoaded', function() {
    const slideContainer = document.querySelector('.slide-container');
    const originalSlides = document.querySelectorAll('.slide');
    const totalSlides = originalSlides.length;
    
    // Clone the last slide and prepend it to the beginning
    const lastSlideClone = originalSlides[totalSlides - 1].cloneNode(true);
    lastSlideClone.classList.add('clone', 'clone-start');
    slideContainer.insertBefore(lastSlideClone, originalSlides[0]);
    
    // Clone the first slide and append it to the end
    const firstSlideClone = originalSlides[0].cloneNode(true);
    firstSlideClone.classList.add('clone', 'clone-end');
    slideContainer.appendChild(firstSlideClone);
    
    // Get all slides including clones
    const allSlides = document.querySelectorAll('.slide');
    const totalSlidesWithClones = allSlides.length;
    
    // Start at index 1 (first real slide, since index 0 is the clone of last slide)
    let currentSlideIndex = 1;
    let isTransitioning = false;

    // Function to update slide positions
    function updateSlidePositions(index) {
        allSlides.forEach((slide, idx) => {
            const offset = (idx - index) * 100;
            slide.style.transform = `translateX(${offset}%)`;
        });
    }

    // Transition duration constant (matches CSS transition duration)
    const TRANSITION_DURATION = 500; // 0.5s = 500ms

    // Function to snap to real slide after transition (for seamless looping)
    function snapToRealSlide() {
        if (currentSlideIndex === 0) {
            // If we're at the clone of the last slide, snap to the real last slide
            currentSlideIndex = totalSlides; // Last real slide (before the end clone)
            
            // Disable transitions
            allSlides.forEach(slide => {
                slide.style.transition = 'none';
            });
            
            updateSlidePositions(currentSlideIndex);
            
            // Force reflow
            void allSlides[0].offsetHeight;
            
            // Re-enable transitions after a brief moment
            setTimeout(() => {
                allSlides.forEach(slide => {
                    slide.style.transition = '';
                });
                isTransitioning = false;
            }, 50);
        } else if (currentSlideIndex === totalSlidesWithClones - 1) {
            // If we're at the clone of the first slide, snap to the real first slide
            currentSlideIndex = 1; // First real slide (after the start clone)
            
            // Disable transitions
            allSlides.forEach(slide => {
                slide.style.transition = 'none';
            });
            
            updateSlidePositions(currentSlideIndex);
            
            // Force reflow
            void allSlides[0].offsetHeight;
            
            // Re-enable transitions after a brief moment
            setTimeout(() => {
                allSlides.forEach(slide => {
                    slide.style.transition = '';
                });
                isTransitioning = false;
            }, 50);
        } else {
            // No snap needed, just re-enable input
            isTransitioning = false;
        }
    }

    // Function to show a specific slide
    function showSlide(index) {
        if (isTransitioning) return; // Prevent input during transition
        
        // Set transitioning flag to block input during the animation
        isTransitioning = true;
        
        currentSlideIndex = index;
        updateSlidePositions(currentSlideIndex);
        
        // After transition completes, snap to real slide if needed
        setTimeout(() => {
            snapToRealSlide();
        }, TRANSITION_DURATION);
    }

    // Function to go to next slide
    function nextSlide() {
        if (isTransitioning) return;
        showSlide(currentSlideIndex + 1);
    }

    // Function to go to previous slide
    function previousSlide() {
        if (isTransitioning) return;
        showSlide(currentSlideIndex - 1);
    }

    // Add keyboard event listener
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            previousSlide();
        }
    });

    // Add mouse scroll listener
    document.addEventListener('wheel', function(event) {
        if (event.deltaY > 0) {
            nextSlide();
        } else if (event.deltaY < 0) {
            previousSlide();
        }
    });

    // Initialize: show the first real slide (index 1)
    updateSlidePositions(1);
});

