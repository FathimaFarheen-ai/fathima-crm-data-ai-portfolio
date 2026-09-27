const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 140
};

let isMobile = window.innerWidth < 768;

const desktopParticleCount = 75;
const mobileParticleCount = 28;

const connectionDistance = 150;


/* =========================================
   CANVAS SIZE
========================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    isMobile = window.innerWidth < 768;

    createParticles();
}


/* =========================================
   MOUSE TRACKING
========================================= */

window.addEventListener("mousemove", function (event) {

    if (isMobile) return;

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


window.addEventListener("mouseleave", function () {

    mouse.x = null;
    mouse.y = null;

});


/* =========================================
   PARTICLE CLASS
========================================= */

class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        this.size = Math.random() * 2 + 1;

    }


    update() {

        this.x += this.vx;
        this.y += this.vy;


        /* Bounce from screen edges */

        if (this.x <= 0 || this.x >= canvas.width) {
            this.vx *= -1;
        }

        if (this.y <= 0 || this.y >= canvas.height) {
            this.vy *= -1;
        }


        /* Gentle mouse interaction */

        if (
            mouse.x !== null &&
            mouse.y !== null
        ) {

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );


            if (distance < mouse.radius) {

                const force =
                    (mouse.radius - distance) /
                    mouse.radius;

                this.x += (dx / distance) * force * 0.4;
                this.y += (dy / distance) * force * 0.4;

            }

        }

    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );


        /* BLUE PARTICLES */

        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";

        ctx.fill();

    }

}


/* =========================================
   CREATE PARTICLES
========================================= */

function createParticles() {

    particles = [];

    const count = isMobile
        ? mobileParticleCount
        : desktopParticleCount;


    for (let i = 0; i < count; i++) {

        particles.push(
            new Particle()
        );

    }

}


/* =========================================
   CONNECT PARTICLES
========================================= */

function connectParticles() {

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const dx =
                particles[i].x -
                particles[j].x;

            const dy =
                particles[i].y -
                particles[j].y;


            const distance = Math.sqrt(
                dx * dx + dy * dy
            );


            if (distance < connectionDistance) {

                const opacity =
                    (1 - distance / connectionDistance) *
                    0.28;


                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );


                /* BLUE CONNECTION LINES */

                ctx.strokeStyle =
                    `rgba(56, 189, 248, ${opacity})`;

                ctx.lineWidth = 0.7;

                ctx.stroke();

            }

        }

    }

}


/* =========================================
   ANIMATION LOOP
========================================= */

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(
        particle => {

            particle.update();
            particle.draw();

        }
    );


    connectParticles();


    requestAnimationFrame(
        animate
    );

}


/* =========================================
   START
========================================= */

resizeCanvas();

animate();

/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".section-header, .about-grid, .skill-group, .timeline-item, .project-card, .certification, .contact-content"
);

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach((element) => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});