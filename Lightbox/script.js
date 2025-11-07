// Lightbox navigation with arrow keys - continuous looping
document.addEventListener('DOMContentLoaded', function() {
    const slideContainer = document.querySelector('.slide-container');
    const originalSlides = document.querySelectorAll('.slide');
    const totalSlides = originalSlides.length;
    const definition = document.querySelector('.definition');

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

    // Track vertical position for each slide (true = on bottom-part, false = on top-part)
    const verticalPositions = new Array(totalSlidesWithClones).fill(false);

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

        // Reset the new slide to top-part if it was on bottom-part
        if (verticalPositions[index]) {
            verticalPositions[index] = false;
            allSlides[index].classList.remove('vertical-down');
        }

        // Always ensure definition is visible when navigating horizontally
        definition.classList.remove('hidden-up');

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

    // Function to handle vertical navigation within a slide
    function navigateVertical(direction) {
        if (isTransitioning) return;

        const currentVerticalPosition = verticalPositions[currentSlideIndex];
        const currentSlide = allSlides[currentSlideIndex];

        if (direction === 'down' && !currentVerticalPosition) {
            // Moving from top-part to bottom-part
            isTransitioning = true;
            verticalPositions[currentSlideIndex] = true;
            currentSlide.classList.add('vertical-down');
            definition.classList.add('hidden-up');

            setTimeout(() => {
                isTransitioning = false;
            }, TRANSITION_DURATION);
        } else if (direction === 'up' && currentVerticalPosition) {
            // Moving from bottom-part to top-part
            isTransitioning = true;
            verticalPositions[currentSlideIndex] = false;
            currentSlide.classList.remove('vertical-down');
            definition.classList.remove('hidden-up');

            setTimeout(() => {
                isTransitioning = false;
            }, TRANSITION_DURATION);
        }
    }

    // Check if horizontal navigation is allowed
    function canNavigateHorizontally() {
        return !verticalPositions[currentSlideIndex]; // Only allow when on top-part
    }

    // Add keyboard event listener
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            if (canNavigateHorizontally()) {
                nextSlide();
            }
        } else if (event.key === 'ArrowLeft') {
            if (canNavigateHorizontally()) {
                previousSlide();
            }
        } else if (event.key === 'ArrowDown') {
            navigateVertical('down');
        } else if (event.key === 'ArrowUp') {
            navigateVertical('up');
        }
    });

    // Add mouse scroll listener (only for horizontal navigation when on top-part)
    document.addEventListener('wheel', function(event) {
        if (!canNavigateHorizontally()) return;

        if (event.deltaY > 0) {
            nextSlide();
        } else if (event.deltaY < 0) {
            previousSlide();
        }
    });

    // Initialize: show the first real slide (index 1)
    updateSlidePositions(1);
});

