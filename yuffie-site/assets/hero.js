/* ==========================================================
   Hero page script — parallax character, petals, audio player
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    if (!mainCanvas) return; // only run on the hero page

    const charLayer = document.getElementById('character-layer');
    const audio = document.getElementById('audio-element');
    const playBtn = document.getElementById('play-trigger');
    const playerCard = document.getElementById('player-card');
    const progressContainer = document.getElementById('progress-cont');
    const progressBar = document.getElementById('progress-actual');
    const timeDisplay = document.getElementById('time-track');
    const volumeSlider = document.getElementById('vol-slider');

    /* ── PARALLAX ──────────────────────────────────────────── */
    let mouseX = 0, mouseY = 0, charX = 0, charY = 0, petalsParamX = 0;

    mainCanvas.addEventListener('mousemove', (e) => {
        const rect = mainCanvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    function updateParallax() {
        const targetX = mouseX * 18;
        const targetY = mouseY * 12;
        charX += (targetX - charX) * 0.08;
        charY += (targetY - charY) * 0.08;
        petalsParamX += (-mouseX * 10 - petalsParamX) * 0.05;
        if (charLayer) charLayer.style.transform = `translate(${charX}px, ${charY}px)`;
        requestAnimationFrame(updateParallax);
    }
    updateParallax();

    /* ── PETALS ────────────────────────────────────────────── */
    const petalCanvas = document.getElementById('petals-canvas');
    const ctx = petalCanvas.getContext('2d');

    function resizeCanvas() {
        petalCanvas.width = mainCanvas.clientWidth;
        petalCanvas.height = mainCanvas.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 100);

    const petalsArray = [];
    const maxPetals = 30;

    class Petal {
        constructor() {
            this.x = Math.random() * petalCanvas.width;
            this.y = Math.random() * -petalCanvas.height;
            this.size = Math.random() * 5 + 3;
            this.speedY = Math.random() * 0.7 + 0.3;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 0.8 - 0.4;
            const colors = ['rgba(239, 68, 68, 0.25)', 'rgba(249, 115, 22, 0.20)', 'rgba(254, 205, 211, 0.25)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 40) * 0.25 + (petalsParamX * 0.02);
            this.angle += this.spin;
            if (this.y > petalCanvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * petalCanvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }
    for (let i = 0; i < maxPetals; i++) petalsArray.push(new Petal());

    function animatePetals() {
        ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
        petalsArray.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();

    /* ── AUDIO PLAYER ──────────────────────────────────────── */
    if (audio) {
        audio.volume = volumeSlider.value;

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = 'Pause';
                playerCard.classList.add('is-playing');
            } else {
                audio.pause();
                playBtn.textContent = 'Play';
                playerCard.classList.remove('is-playing');
            }
        });

        function formatTime(secs) {
            if (isNaN(secs)) return "0:00";
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        });
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        });
        volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
        audio.addEventListener('ended', () => {
            playBtn.textContent = 'Play';
            progressBar.style.width = '0%';
            playerCard.classList.remove('is-playing');
        });
    }
});
