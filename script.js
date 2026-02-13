(function() {
    // Block all scrolling
    document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // ===== MUSIC CONTROL =====
    const audio = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;
    
    // Try to play music automatically
    function initMusic() {
        audio.volume = 0.5; // Set volume to 50%
        
        audio.play().then(() => {
            isPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(error => {
            console.log("Auto-play blocked. User must tap music button.");
            isPlaying = false;
            musicToggle.textContent = '🔈';
        });
    }
    
    // Try to initialize music on page load
    initMusic();
    
    // Toggle music on button click
    musicToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isPlaying) {
            audio.pause();
            musicToggle.textContent = '🔈';
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicToggle.textContent = '🔊';
                isPlaying = true;
            }).catch(error => {
                console.log("Playback failed:", error);
                alert("Please tap the screen first to enable music");
            });
        }
    });
    
    // Also try to play on first touch anywhere (helps with mobile autoplay policies)
    document.body.addEventListener('touchstart', function once() {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = '🔊';
            }).catch(() => {});
        }
        document.body.removeEventListener('touchstart', once);
    }, { once: true });

    // INTRO REVEAL
    const intro = document.getElementById('introOverlay');
    const mainLetter = document.getElementById('mainLetter');
    const revealBtn = document.getElementById('revealButton');

    revealBtn.addEventListener('click', () => {
        intro.classList.add('hide-intro');
        mainLetter.classList.add('show-letter');
        // Set initial position after letter is shown
        setTimeout(setInitialPosition, 200);
    });

    // BUTTON LOGIC
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const buttonArea = document.getElementById('buttonArea');
    const acceptedMsg = document.getElementById('acceptedMessage');
    
    let yesSize = 1;
    let loveConfirmed = false;

    // Make sure button area has position relative
    buttonArea.style.position = 'relative';

    // Set initial position for NO button (right side)
    function setInitialPosition() {
        const areaRect = buttonArea.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        // Make sure button dimensions are valid
        if (btnRect.width === 0) return;
        
        noBtn.style.left = (areaRect.width - btnRect.width - 10) + 'px';
        noBtn.style.top = ((areaRect.height / 2) - (btnRect.height / 2)) + 'px';
        noBtn.style.right = 'auto';
        noBtn.style.transform = 'none';
    }

    // TOUCH HANDLER FOR NO BUTTON - MAKES IT MOVE
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (loveConfirmed) return;
        
        const touch = e.touches[0];
        if (!touch) return;
        
        // Get button area boundaries
        const areaRect = buttonArea.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        // Calculate safe boundaries (keep button inside)
        const minX = 5;
        const maxX = areaRect.width - btnRect.width - 5;
        const minY = 5;
        const maxY = areaRect.height - btnRect.height - 5;
        
        if (maxX <= minX || maxY <= minY) return;
        
        // Touch position relative to button area
        const touchX = touch.clientX - areaRect.left;
        const touchY = touch.clientY - areaRect.top;
        
        // Find new position away from touch
        let newX, newY;
        let attempts = 0;
        const minDistance = 80;
        
        do {
            newX = minX + Math.random() * (maxX - minX);
            newY = minY + Math.random() * (maxY - minY);
            attempts++;
            if (attempts > 50) break;
        } while (Math.hypot(newX - touchX, newY - touchY) < minDistance && attempts < 50);
        
        // Move the button
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        noBtn.style.right = 'auto';
        
        // Grow YES button
        if (yesSize < 2.0) {
            yesSize += 0.15;
            yesBtn.style.transform = `translateY(-50%) scale(${yesSize})`;
        }
    }, { passive: false });

    // Also handle mouse for testing
    noBtn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        if (loveConfirmed) return;
        
        const areaRect = buttonArea.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        const minX = 5;
        const maxX = areaRect.width - btnRect.width - 5;
        const minY = 5;
        const maxY = areaRect.height - btnRect.height - 5;
        
        if (maxX <= minX || maxY <= minY) return;
        
        const mouseX = e.clientX - areaRect.left;
        const mouseY = e.clientY - areaRect.top;
        
        let newX, newY;
        let attempts = 0;
        const minDistance = 80;
        
        do {
            newX = minX + Math.random() * (maxX - minX);
            newY = minY + Math.random() * (maxY - minY);
            attempts++;
            if (attempts > 50) break;
        } while (Math.hypot(newX - mouseX, newY - mouseY) < minDistance && attempts < 50);
        
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        noBtn.style.right = 'auto';
        
        if (yesSize < 2.0) {
            yesSize += 0.15;
            yesBtn.style.transform = `translateY(-50%) scale(${yesSize})`;
        }
    });

    // Prevent any click on no button
    noBtn.addEventListener('click', (e) => e.preventDefault());

    // YES BUTTON CLICK HANDLER
    yesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (loveConfirmed) return;
        loveConfirmed = true;
        
        // Hide the no button completely
        noBtn.style.opacity = '0';
        noBtn.style.pointerEvents = 'none';
        
        // Show the acceptance message
        acceptedMsg.classList.add('show');
        
        // Make yes button bigger and change color
        yesBtn.style.transform = 'translateY(-50%) scale(2.2)';
        yesBtn.style.background = '#f0c5b5';
        yesBtn.style.boxShadow = '0 8px 0 #b48a7a';
        
        // Celebration sparkle
        const sparkle = document.createElement('div');
        sparkle.innerHTML = 'I Love You!!';
        sparkle.style.position = 'fixed';
        sparkle.style.top = '50%';
        sparkle.style.left = '50%';
        sparkle.style.transform = 'translate(-50%, -50%)';
        sparkle.style.fontSize = '4rem';
        sparkle.style.zIndex = '9999';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.textAlign = 'center';
        sparkle.style.width = '100%';
        document.body.appendChild(sparkle);
        
        // Remove sparkle after 1 second
        setTimeout(() => sparkle.remove(), 1000);
    });

    // Reset position on window resize
    window.addEventListener('resize', function() {
        if (!loveConfirmed && mainLetter.classList.contains('show-letter')) {
            setInitialPosition();
        }
    });

    // Try to set initial position after everything loads
    window.addEventListener('load', function() {
        if (mainLetter.classList.contains('show-letter')) {
            setTimeout(setInitialPosition, 300);
        }
    });
})();
