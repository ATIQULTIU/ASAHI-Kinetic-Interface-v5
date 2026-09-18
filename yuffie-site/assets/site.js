/* ==========================================================
   ASAHI // Kinetic Interface — Shared Site Script
   Nav, ambient embers, cursor glow, scroll reveals, utilities
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── PAGE ENTRANCE ─────────────────────────────────────── */
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
        document.body.classList.remove('page-enter');
        document.body.classList.add('page-loaded');
    });

    /* ── NAV: mobile toggle + active link ─────────────────── */
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => links.classList.remove('open'))
        );
    }
    const current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    /* ── CURSOR GLOW ───────────────────────────────────────── */
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        let gx = 0, gy = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
        (function loop() {
            gx += (tx - gx) * 0.15;
            gy += (ty - gy) * 0.15;
            glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
            requestAnimationFrame(loop);
        })();
    }

    /* ── SCROLL REVEALS ────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ── AMBIENT EMBER PARTICLES (site-wide canvas) ───────── */
    const emberCanvas = document.getElementById('embers-canvas');
    if (emberCanvas) {
        const ctx = emberCanvas.getContext('2d');
        let w, h;
        function resize() {
            w = emberCanvas.width = window.innerWidth;
            h = emberCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        const colors = ['181,137,61', '239,68,68', '255,255,255'];
        const embers = Array.from({ length: COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            vy: -(Math.random() * 0.35 + 0.08),
            vx: (Math.random() - 0.5) * 0.15,
            a: Math.random() * 0.5 + 0.08,
            c: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2
        }));

        function tick(t) {
            ctx.clearRect(0, 0, w, h);
            embers.forEach(p => {
                p.y += p.vy;
                p.x += p.vx + Math.sin(t / 2000 + p.phase) * 0.15;
                if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.c},${p.a})`;
                ctx.shadowColor = `rgba(${p.c},${p.a})`;
                ctx.shadowBlur = 4;
                ctx.fill();
            });
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ── TILT-ON-HOVER (gallery cards, etc.) ───────────────── */
    document.querySelectorAll('[data-tilt]').forEach(card => {
        const strength = parseFloat(card.dataset.tilt) || 10;
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(700px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
        });
    });

    /* ── ANIMATED COUNTERS (data-count="123") ──────────────── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const cIo = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                let cur = 0;
                const step = () => {
                    cur += target / 40;
                    if (cur >= target) { el.textContent = target + suffix; return; }
                    el.textContent = Math.floor(cur) + suffix;
                    requestAnimationFrame(step);
                };
                step();
                cIo.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach(c => cIo.observe(c));
    }

    /* ── ANIMATED STAT RINGS/BARS (data-fill="82") ─────────── */
    const fills = document.querySelectorAll('[data-fill]');
    if (fills.length && 'IntersectionObserver' in window) {
        const fIo = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const val = el.dataset.fill;
                requestAnimationFrame(() => {
                    if (el.classList.contains('stat-ring')) {
                        el.style.setProperty('--fill', val + '%');
                    } else {
                        el.style.width = val + '%';
                    }
                });
                fIo.unobserve(el);
            });
        }, { threshold: 0.3 });
        fills.forEach(f => fIo.observe(f));
    }

    /* ── TYPEWRITER (data-typewriter) ──────────────────────── */
    document.querySelectorAll('[data-typewriter]').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.style.borderRight = '2px solid var(--gold)';
        let i = 0;
        function typeStep() {
            if (i <= text.length) {
                el.textContent = text.slice(0, i);
                i++;
                setTimeout(typeStep, 28);
            } else {
                el.style.animation = 'blinkCaret 0.9s steps(1) infinite';
            }
        }
        const styleTag = document.createElement('style');
        styleTag.textContent = '@keyframes blinkCaret { 50% { border-color: transparent; } }';
        document.head.appendChild(styleTag);

        if ('IntersectionObserver' in window) {
            const tIo = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { typeStep(); tIo.unobserve(entry.target); }
                });
            }, { threshold: 0.5 });
            tIo.observe(el);
        } else {
            typeStep();
        }
    });

    /* ── FILTER BAR (gallery categories, etc.) ─────────────── */
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
        const buttons = filterBar.querySelectorAll('[data-filter]');
        const items = document.querySelectorAll('[data-category]');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                items.forEach(item => {
                    const match = filter === 'all' || item.dataset.category === filter;
                    item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                    if (match) {
                        item.style.display = '';
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        });
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.92)';
                        setTimeout(() => { item.style.display = 'none'; }, 350);
                    }
                });
            });
        });
    }

    /* ── CONTACT FORM (decorative, no backend) ─────────────── */
    const form = document.getElementById('transmission-form');
    if (form) {
        const btn = form.querySelector('button[type="submit"]');
        const status = document.getElementById('form-status');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.disabled = true;
            btn.textContent = 'Transmitting…';
            status.textContent = '';
            status.className = '';
            setTimeout(() => {
                btn.textContent = 'Sent ✓';
                status.textContent = 'Transmission received. Expect a reply from the void shortly.';
                status.className = 'form-success';
                form.reset();
                setTimeout(() => { btn.disabled = false; btn.textContent = 'Send Transmission'; }, 2200);
            }, 1200);
        });
    }
});
