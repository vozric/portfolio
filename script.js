document.addEventListener('DOMContentLoaded', () => {
    // --- AUDIO & VIDEO HANDLING ---
    const bgVideo = document.getElementById('bg-video');
    const bgMusic = document.getElementById('bg-music');
    const volumeToggle = document.getElementById('volume-toggle');
    const volumeIcon = volumeToggle.querySelector('i');
    
    let isMuted = false;
    bgMusic.volume = 1; 
    bgVideo.muted = true; // Video will always stay muted now

    // Auto-play attempt on load
    bgVideo.play().catch(e => console.log("Video autoplay prevented:", e));

    const enterScreen = document.getElementById('enter-screen');
    
    enterScreen.addEventListener('click', () => {
        enterScreen.classList.add('hidden');
        isMuted = false;
        volumeIcon.className = 'fas fa-volume-up';
        bgMusic.play().catch(err => console.log(err));
    });

    // Global Volume Toggle controls play/pause now
    volumeToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the body click listener
        isMuted = !isMuted;
        
        if (isMuted) {
            volumeIcon.className = 'fas fa-volume-mute';
            bgMusic.pause();
        } else {
            volumeIcon.className = 'fas fa-volume-up';
            bgMusic.volume = 1;
            bgMusic.play().catch(err => console.log(err));
        }
    });

    // Update progress bar
    const progressEl = document.getElementById('progress');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');

    bgMusic.addEventListener('timeupdate', () => {
        if (!isNaN(bgMusic.duration)) {
            const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
            progressEl.style.width = `${progressPercent}%`;
            
            currentTimeEl.textContent = formatTime(bgMusic.currentTime);
            totalTimeEl.textContent = formatTime(bgMusic.duration);
        }
    });

    // Fallback animation for progress bar if audio is missing
    bgMusic.addEventListener('error', () => {
        console.log("Audio file not found. Using placeholder behavior.");
        totalTimeEl.textContent = "5:22";
    });

    bgMusic.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(bgMusic.duration);
    });

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // --- MODAL HANDLING ---
    const viewWorksBtn = document.getElementById('view-works-btn');
    const modal = document.getElementById('portfolio-modal');
    const closeBtn = document.getElementById('close-modal');

    viewWorksBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling underneath
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- SNOWFALL EFFECT ---
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const particles = [];
    const particleCount = 120;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Reset when it goes off screen
            if (this.y > height) {
                this.y = -10;
                this.x = Math.random() * width;
            }
            if (this.x > width) {
                this.x = -10;
            } else if (this.x < -10) {
                this.x = width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initSnow() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateSnow() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateSnow);
    }

    initSnow();
    animateSnow();
});
