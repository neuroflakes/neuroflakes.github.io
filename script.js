const bg = document.getElementById("bg");
const palette = [
    "#e4b10b",
    "#ff0077",
    "#8acf30",
    "#0066ff",
    "#68387e",
];


// clock

function updateClock(){
    
    const now = new Date();
    
    document.getElementById("clock").textContent =
    now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    
    const hour = now.getHours();
    
    let greeting = "";
    
    if(hour < 12){
        greeting = "";
    }else if(hour < 17){
        greeting = "";
    }else if(hour < 22){
        greeting = "";
    }else{
        greeting = "";
    }
    
    document.getElementById("greeting").textContent = greeting;
    
}

updateClock();
setInterval(updateClock,1000);

// scramble text

const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%&*_-+=<>?";

document.querySelectorAll(".scramble").forEach((el) => {
    
    const original = el.dataset.text || el.innerText;
    
    let interval = null;
    
    const scramble = () => {
        
        let iteration = 0;
        
        clearInterval(interval);
        
        interval = setInterval(() => {
            
            el.innerText = original
            .split("")
            .map((char, i) => {
                
                if (char === " ") return " ";
                
                //center letters first
                const distanceFromCenter = Math.abs(i - original.length / 2);
                const threshold = iteration - distanceFromCenter * 0.3;
                
                if (threshold > i) {
                    return char;
                }
                
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
            
            if (iteration > original.length) {
                clearInterval(interval);
                el.innerText = original;
            }
            
            iteration += 0.8; // FAST animation
            
        }, 25);
    };
    
    const reset = () => {
        clearInterval(interval);
        el.innerText = original;
    };
    
    el.addEventListener("mouseenter", scramble);
    el.addEventListener("mouseleave", reset);
    
});

// cursor

const cursor = document.querySelector(".cursor-dot");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

// hover detection 

document.querySelectorAll("a, .scramble").forEach((el) => {
    el.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });
    
    el.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});


// trail

const symbols = ["+"];

const grid = 12;
const particles = [];

function snap(v) {
    return Math.round(v / grid) * grid;
}

// mouse

let last = 0;

document.addEventListener("mousemove", (e) => {
    
    const now = Date.now();
    
    if (now - last > 40) {
        
        createParticle(snap(e.clientX), snap(e.clientY));
        createParticle(snap(e.clientX + (Math.random() * 8 - 4)),
        snap(e.clientY + (Math.random() * 8 - 4)));
        
        last = now;
    }
});

// particle creator

function createParticle(x, y) {
    
    const el = document.createElement("div");
    el.className = "particle";
    
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    
    el.style.left = x + "px";
    el.style.top = y + "px";
    
    el.style.color = palette[Math.floor(Math.random() * palette.length)];
    
    const size = Math.random() * 10 + 8;
    el.style.fontSize = size + "px";
    
    document.body.appendChild(el);
    
    particles.push({
        el,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.001,
        life: 1
    });
}

// animation

function animate() {
    
    const links = document.querySelectorAll("a");
    const image = document.getElementById("hero-image");
    const imgRect = image
        ? image.getBoundingClientRect()
        : { left: 0, right: 0, top: 0, bottom: 0 };
    
    for (let i = particles.length - 1; i >= 0; i--) {
        
        const p = particles[i];
        
        const closestX = Math.max(imgRect.left, Math.min(p.x, imgRect.right));
        const closestY = Math.max(imgRect.top, Math.min(p.y, imgRect.bottom));
        
        const dx = p.x - closestX;
        const dy = p.y - closestY;
        
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 1) {
            p.life -= (80 - dist) * 0.015;
        }
        
        p.x += Math.sin(p.y * 0.05) * 0.15;
        p.y += p.vy;
        
        p.vy += 0.005;   // gravity
        
        p.el.style.left = p.x + "px";
        p.el.style.top = p.y + "px";
        
        /* link interaction */
        links.forEach(link => {
            
            const r = link.getBoundingClientRect();
            
            const dx = p.x - (r.left + r.width / 2);
            const dy = p.y - (r.top + r.height / 2);
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 90) {
                p.life -= 0.02; // faster decay near links
            }
        });
        
        /* normal decay */
        p.life -= 0.005;
        
        p.el.style.opacity = p.life;
        p.el.style.transform = `translate(-50%, -50%) scale(${p.life})`;
        
        if (p.life <= 0) {
            p.el.remove();
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

// colors

const header = document.querySelector("h1");

if (header) {
    
    const text = header.innerText;
    
    header.innerHTML = "";
    
    const spans = [];
    
    for (let char of text) {
        
        const span = document.createElement("span");
        span.innerText = char;
        
        if (char !== " ") {
            const color = palette[Math.floor(Math.random() * palette.length)];
            span.style.color = color;
        }
        
        spans.push(span);
        header.appendChild(span);
    }
    
    spans.forEach((span, index) => {
        
        span.addEventListener("mouseenter", () => {
            
            spans.forEach((s, i) => {
                
                const d = Math.abs(i - index);
                
                if (d === 0) {
                    s.style.transform = "translateY(-4px) scale(1.3)";
                }
                else if (d === 1) {
                    s.style.transform = "translateY(-2px) scale(1.15)";
                }
                else if (d === 2) {
                    s.style.transform = "translateY(-1px) scale(1.05)";
                }
                else {
                    s.style.transform = "scale(1)";
                }
                
            });
            
        });
        
    });
    
    header.addEventListener("mouseleave", () => {
        
        spans.forEach(span => {
            span.style.transform = "scale(1)";
        });
        
    });
}

// art gallery (scattered, non-overlapping, with titles)
if (document.body.dataset.page === "art") {
    const works = [
        {
            image: "images/art/intoultramarine.png",
            link: "https://neuroflakes.artstation.com/projects/GvLGyV",
            title: ".: into ultramarine"
        },
        {
            image: "images/art/songofthetidalsmokers.jpg",
            link: "https://neuroflakes.artstation.com/projects/lDvG3k",
            title: ".: song of the tidal smokers"
        },
        {
            image: "images/art/nodrumsinthefog.jpg",
            link: "https://neuroflakes.artstation.com/projects/YBlGXb",
            title: ".: no drums in the fog"
        },
        {
            image: "images/art/thepetrichorestate.jpg",
            link: "https://neuroflakes.artstation.com/projects/8bXBQn",
            title: ".: the petrichor estate"
        },
        {
            image: "images/art/throatburn.jpg",
            link: "https://neuroflakes.artstation.com/projects/qeVJ8P",
            title: ".: throatburn • steam • drone"
        },
        {
            image: "images/art/transportation.jpg",
            link: "https://neuroflakes.artstation.com/projects/vDVzAE",
            title: ".: transportation"
        }
    ];
    const gallery = document.getElementById("gallery");
    const TITLE_BAR_HEIGHT = 22; // must match .artwork-title height in CSS
    const MIN_WIDTH = 120;
    const MAX_WIDTH = 200;
    const MAX_OVERLAP_RATIO = 0.1; // allow up to ~12% of a box's area to overlap

    function overlapRatio(a, b) {
        const xOverlap = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
        const yOverlap = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
        const overlapArea = xOverlap * yOverlap;
        const smallerArea = Math.min(a.w * a.h, b.w * b.h);
        return smallerArea > 0 ? overlapArea / smallerArea : 0;
    }

    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img); // one broken image shouldn't block the rest
            img.src = src;
        });
    }

    Promise.all(works.map(w => loadImage(w.image))).then((loaded) => {
        const boundsW = gallery.clientWidth;
        const boundsH = gallery.clientHeight;
        const placed = [];
        works.forEach((work, i) => {
            const natural = loaded[i];
            const naturalW = natural.naturalWidth || 200;
            const naturalH = natural.naturalHeight || 200;
            const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, naturalW));
            const height = (naturalH / naturalW) * width + TITLE_BAR_HEIGHT;
            const maxX = Math.max(0, boundsW - width);
            const maxY = Math.max(0, boundsH - height);
            let x = 0, y = 0, attempts = 0;
            while (attempts < 300) {
                x = Math.random() * maxX;
                y = Math.random() * maxY;
                const candidate = { x, y, w: width, h: height };
                if (!placed.some(p => overlapRatio(candidate, p) > MAX_OVERLAP_RATIO)) {
                    break;
                }
                attempts++;
            }
            // after 300 tries it still places at the last attempted spot rather than failing silently
            placed.push({ x, y, w: width, h: height });
            const a = document.createElement("a");
            a.href = work.link;
            a.target = "_blank";
            a.className = "artwork-wrap";
            a.style.left = x + "px";
            a.style.top = y + "px";
            a.style.width = width + "px";
            a.style.height = height + "px"; // now matches the collision math exactly
            const titleBar = document.createElement("div");
            titleBar.className = "artwork-title";
            titleBar.textContent = work.title;
            const imgEl = document.createElement("img");
            imgEl.src = work.image;
            imgEl.className = "artwork";
            a.appendChild(titleBar);
            a.appendChild(imgEl);
            gallery.appendChild(a);
        });
    });
}

// art background

if (document.body.dataset.page === "art" || document.body.dataset.page === "games") {

    const squares = [];
    const COUNT = 67;

    function randSquare(min, max) {
        return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < COUNT; i++) {

        const el = document.createElement("div");

        const size = randSquare(30, 160);

        el.style.position = "absolute";
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.borderRadius = "0";

        el.style.background = palette[Math.floor(Math.random() * palette.length)];
        el.style.opacity = randSquare(0.03, 0.35); // lighter than home

        el.style.left = randSquare(0, window.innerWidth) + "px";
        el.style.top = randSquare(0, window.innerHeight) + "px";

        bg.appendChild(el);

        squares.push({
            el,
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top),
            vx: randSquare(-0.2, 0.2),
            vy: randSquare(-0.2, 0.2),
            depth: randSquare(0.2, 2)
        });
    }

    function animateArtBG() {

        for (let s of squares) {

            s.x += s.vx * s.depth;
            s.y += s.vy * s.depth;

            if (s.x < -200) s.x = window.innerWidth + 200;
            if (s.x > window.innerWidth + 200) s.x = -200;

            if (s.y < -200) s.y = window.innerHeight + 200;
            if (s.y > window.innerHeight + 200) s.y = -200;

            s.el.style.left = s.x + "px";
            s.el.style.top = s.y + "px";
        }

        requestAnimationFrame(animateArtBG);
    }

    animateArtBG();
}

// home bg

if (document.body.dataset.page === "home") {

    const circles = [];
    const COUNT = 67;

    function rand(min,max){
        return Math.random()*(max-min)+min;
    }

    for (let i=0;i<COUNT;i++){

        const el = document.createElement("div");

        const size = rand(30,160);

        el.style.position = "absolute";
        el.style.width = size+"px";
        el.style.height = size+"px";
        el.style.borderRadius = "50%";

        el.style.background = palette[Math.floor(Math.random()*palette.length)];
        el.style.opacity = rand(0.05,0.41);

        el.style.left = rand(0,window.innerWidth)+"px";
        el.style.top = rand(0,window.innerHeight)+"px";

        bg.appendChild(el);

        circles.push({
            el,
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top),
            vx: rand(-0.2,0.2),
            vy: rand(-0.2,0.2),
            depth: rand(0.2,2)
        });
    }

    function animateBG(){

        for (let c of circles){

            c.x += c.vx * c.depth;
            c.y += c.vy * c.depth;

            if (c.x < -200) c.x = window.innerWidth + 200;
            if (c.x > window.innerWidth + 200) c.x = -200;

            if (c.y < -200) c.y = window.innerHeight + 200;
            if (c.y > window.innerHeight + 200) c.y = -200;

            c.el.style.left = c.x+"px";
            c.el.style.top = c.y+"px";
        }

        requestAnimationFrame(animateBG);
    }

    animateBG();
}


// latest song (icon play/restart buttons, terminal-style block scrubber)

if (document.body.dataset.page === "music") {

    const latestSong = {
        title: "scrapped_melody[16.01.26]",
        cover: "images/covers/recentcvr.png",
        src: "audio/for you, i sleep.flac"
    };

    const audio = new Audio(latestSong.src);

    document.getElementById("latest-cover").src = latestSong.cover;
    document.getElementById("latest-title").textContent = latestSong.title;

    const artWrap = document.getElementById("latest-art-wrap");
    const playBtn = document.getElementById("latest-play-btn");
    const restartBtn = document.getElementById("latest-restart-btn");
    const scrubberWrap = document.getElementById("latest-scrubber");
    const scrubberText = document.getElementById("latest-scrubber-text");

    const PLAY_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>';
    const RESTART_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><rect x="4" y="5" width="2" height="14" fill="currentColor"/><path d="M20 5v14L9 12z" fill="currentColor"/></svg>';

    playBtn.innerHTML = PLAY_ICON;
    restartBtn.innerHTML = RESTART_ICON;

    const SCRUB_LENGTH = 34;

    function renderScrubber(pct) {

        const filledCount = Math.round(pct * SCRUB_LENGTH);
        const filled = "▓".repeat(filledCount);
        const empty = "░".repeat(SCRUB_LENGTH - filledCount);

        scrubberText.innerHTML = `<span class="filled">${filled}</span>${empty}`;
    }

    renderScrubber(0);

    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    restartBtn.addEventListener("click", () => {
        audio.currentTime = 0;
        renderScrubber(0);
    });

    audio.addEventListener("play", () => {
        playBtn.innerHTML = PAUSE_ICON;
        artWrap.classList.add("playing");
    });

    audio.addEventListener("pause", () => {
        playBtn.innerHTML = PLAY_ICON;
        artWrap.classList.remove("playing");
    });

    audio.addEventListener("ended", () => {
        playBtn.innerHTML = PLAY_ICON;
        artWrap.classList.remove("playing");
    });

    audio.addEventListener("timeupdate", () => {
        renderScrubber((audio.currentTime / audio.duration) || 0);
    });

    scrubberWrap.addEventListener("click", (e) => {
        const rect = scrubberWrap.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pct * audio.duration;
    });
}

// music wall (scattered, non-overlapping, singles + album + upcoming release)

if (document.body.dataset.page === "music") {

    const musicItems = [
        { type: "single", title: "49°•+cel.mtRska•", cover: "images/covers/celmatroska.png", link: "https://youtu.be/S5ejaWZBgFY?si=QeQTWsqbJG7Xmima", year: "01.25" },
        { type: "single", title: "●:: neoplastic steam harbour ::●", cover: "images/covers/neoplastic.jpeg", link: "https://youtu.be/I_8DUAOOgG8?si=Vofi-Q8Q9eQSyqvI", year: "03.24" },
        { type: "single", title: "▓ a long time located nowhere :- ,,", cover: "images/covers/nowhere.jpg", link: "https://youtu.be/LZSmi-qBpNg?si=rI7QOtgaUb_Pw28W", year: "03.24" },
        { type: "single", title: ":* the window shines on yesterday [spinsplash]", cover: "images/covers/windows.jpeg", link: "https://youtu.be/3LvFNAV8kq0?si=qHUrXNfFVqi5PO4P", year: "04.24" },
        { type: "single", title: "foggy_++ hands .:: ●spa.ce", cover: "images/covers/foggy.jpeg", link: "https://youtu.be/c4XFKdLVQ3w?si=Xobktbq5WXP_BcJj", year: "09.24" },
        { type: "single", title: "_ spaces_gutted─⊹ ::+ [ppooll]", cover: "images/covers/spaces.jpeg", link: "https://youtu.be/4VtLv_qUaVI?si=mbQHI9MRuwCfzPdP", year: "09.24" },
        { type: "single", title: "+in_raining.|colours ✚ •●", cover: "images/covers/rainingcolors.png", link: "https://soundcloud.com/myllboris/in_raining-colours-o", year: "02.26" },
        { type: "album", title: ".rest∘point:", cover: "images/covers/restpoint.jpg", link: "https://myllboris.bandcamp.com/album/rest-point", year: "04.25" },
        { type: "upcoming", title: "a good night iridescent", cover: "images/covers/01.jpg", year: "'26" }
    ];

    const wall = document.getElementById("singles-wall");

    const GAP = 16;
    const MAX_ATTEMPTS = 600;
    const SIZE_BY_TYPE = {
        single: { min: 130, max: 150 },
        album: { min: 190, max: 210 },
        upcoming: { min: 170, max: 200 }
    };

    function rectsOverlapSingles(a, b) {
        return !(
            a.x + a.w + GAP <= b.x ||
            b.x + b.w + GAP <= a.x ||
            a.y + a.h + GAP <= b.y ||
            b.y + b.h + GAP <= a.y
        );
    }

    const wallW = wall.clientWidth;
    const wallH = wall.clientHeight;
    const placedSingles = [];

    // place the album/upcoming (bigger) tiles first so they get first pick of open space,
    // then fit the smaller singles into what's left
    const ordered = [...musicItems].sort((a, b) => {
        const order = { album: 0, upcoming: 0, single: 1 };
        return order[a.type] - order[b.type];
    });

    ordered.forEach((item) => {

        const { min, max } = SIZE_BY_TYPE[item.type];
        const size = min + Math.random() * (max - min);

        const maxX = Math.max(0, wallW - size);
        const maxY = Math.max(0, wallH - size);

        let x = 0;
        let y = 0;
        let attempts = 0;
        let found = false;

        while (attempts < MAX_ATTEMPTS) {

            x = Math.random() * maxX;
            y = Math.random() * maxY;

            const candidate = { x, y, w: size, h: size };

            if (!placedSingles.some(p => rectsOverlapSingles(candidate, p))) {
                found = true;
                break;
            }

            attempts++;
        }

        if (!found) {
            console.warn("Couldn't place:", item.title);
            return; // skip this tile
        }

        placedSingles.push({ x, y, w: size, h: size });

        const isClickable = item.type !== "upcoming";

        const tile = document.createElement(isClickable ? "a" : "div");
        if (isClickable) {
            tile.href = item.link;
            tile.target = "_blank";
        }
        tile.className = `single-tile type-${item.type}`;
        tile.style.left = x + "px";
        tile.style.top = y + "px";
        tile.style.width = size + "px";
        tile.style.height = size + "px";

        const img = document.createElement("img");
        img.src = item.cover;
        img.className = "single-cover";

        const badge = document.createElement("div");
        badge.className = `wall-badge wall-badge-${item.type}`;
        badge.textContent = item.type === "upcoming" ? "coming soon" : item.type;

        const scrim = document.createElement("div");
        scrim.className = "single-scrim";

        const metaTitle = document.createElement("div");
        metaTitle.className = "single-meta-title";
        metaTitle.textContent = item.title;

        const metaSub = document.createElement("div");
        metaSub.className = "single-meta-sub";
        metaSub.textContent = item.type === "upcoming"
            ? `${item.year} · album soon!`
            : `${item.year} · listen ↗`;

        scrim.appendChild(metaTitle);
        scrim.appendChild(metaSub);

        tile.appendChild(img);
        tile.appendChild(badge);
        tile.appendChild(scrim);
        wall.appendChild(tile);
    });
}

// music background

if (document.body.dataset.page === "music") {

    const LINE_COUNT = 36;
    const lines = [];

    function randLine(min, max) {
        return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < LINE_COUNT; i++) {

        const el = document.createElement("div");
        el.className = "bg-line";

        const thickness = randLine(2, 26);
        const startX = randLine(0, window.innerWidth);

        el.style.width = thickness + "px";
        el.style.left = startX + "px";
        el.style.background = palette[Math.floor(Math.random() * palette.length)];
        el.style.opacity = randLine(0.05, 0.22);

        // each line breathes its own thickness on its own timing
        el.style.animationDuration = randLine(4, 9) + "s";
        el.style.animationDelay = "-" + randLine(0, 9) + "s";

        bg.appendChild(el);

        lines.push({
            el,
            x: startX,
            vx: randLine(-0.15, 0.15)
        });
    }

    function animateLinesBG() {

        for (let l of lines) {

            l.x += l.vx;

            if (l.x < -40) l.x = window.innerWidth + 40;
            if (l.x > window.innerWidth + 40) l.x = -40;

            l.el.style.left = l.x + "px";
        }

        requestAnimationFrame(animateLinesBG);
    }

    animateLinesBG();
}

// software / contact bg

if (
    document.body.dataset.page === "software" ||
    document.body.dataset.page === "contact"
) {

    const symbols =
        document.body.dataset.page === "software"
            ? ["+"]
            : ["n","e","u","r","o","f","l","a","k","s"];

    const pieces = [];
    const COUNT = document.body.dataset.page === "software" ? 67 : 67;

    function rand(min, max){
        return Math.random() * (max - min) + min;
    }

    for(let i = 0; i < COUNT; i++){

        const el = document.createElement("div");

        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        el.style.position = "absolute";
        el.style.left = rand(0, window.innerWidth) + "px";
        el.style.top = rand(0, window.innerHeight) + "px";

        el.style.fontFamily = "'JetBrains Mono', monospace";
        el.style.fontWeight = "150";
        el.style.fontSize = rand(10, 200) + "px";

        el.style.color = palette[Math.floor(Math.random() * palette.length)];
        el.style.opacity = rand(0.03, 0.35);

        el.style.userSelect = "none";
        el.style.pointerEvents = "none";

        bg.appendChild(el);

        pieces.push({
            el,
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top),
            vx: rand(-0.18, 0.18),
            vy: rand(-0.18, 0.18),
            rot: rand(-0.2, 0.2),
            angle: rand(0, 360)
        });
    }

    function animateCodeBG(){

        for(const p of pieces){

            p.x += p.vx;
            p.y += p.vy;

            if(p.x < -60) p.x = window.innerWidth + 60;
            if(p.x > window.innerWidth + 60) p.x = -60;

            if(p.y < -60) p.y = window.innerHeight + 60;
            if(p.y > window.innerHeight + 60) p.y = -60;

            p.el.style.left = p.x + "px";
            p.el.style.top = p.y + "px";
        }

        requestAnimationFrame(animateCodeBG);
    }

    animateCodeBG();
}

// games

// games gallery

if (document.body.dataset.page === "games") {

    const games = [
        {
            image: "images/art/nila.png",
            link: "https://disarch42.itch.io/nila",
            title: ".: Nila · GMTK '25",
            role: "artist",
            genre: "puzzle",
            status: "released"
        },
        {
            image: "images/art/ashtrays.png",
            link: "https://wdan30.itch.io/dream-ashtrays",
            title: ".: dream_ashtrays · UWGJ '24",
            role: "writer, artist, composer",
            genre: "experimental",
            status: "prototype [discontinued]"
        },
        {
            image: "images/art/CnH.png",
            link: "https://kapendev.itch.io/clean-haunted",
            title: ".: Clean & Haunted · GBJAM '24",
            role: "composer [as Myllboris]",
            genre: "retro",
            status: "released"
        }
    ];

    const gallery = document.getElementById("games-gallery");

    const TITLE_BAR_HEIGHT = 22;
    const GAP = 18;
    const MIN_WIDTH = 140;
    const MAX_WIDTH = 240;

    function rectsOverlap(a, b) {
        return !(
            a.x + a.w + GAP <= b.x ||
            b.x + b.w + GAP <= a.x ||
            a.y + a.h + GAP <= b.y ||
            b.y + b.h + GAP <= a.y
        );
    }

    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img);
            img.src = src;
        });
    }

    Promise.all(games.map(g => loadImage(g.image))).then((loaded) => {

        const boundsW = gallery.clientWidth;
        const boundsH = gallery.clientHeight;

        const placed = [];

        games.forEach((game, i) => {

            const natural = loaded[i];

            const naturalW = natural.naturalWidth || 200;
            const naturalH = natural.naturalHeight || 200;

            const width = Math.min(
                MAX_WIDTH,
                Math.max(MIN_WIDTH, naturalW)
            );

            const height =
                (naturalH / naturalW) * width +
                TITLE_BAR_HEIGHT;

            const maxX = Math.max(0, boundsW - width);
            const maxY = Math.max(0, boundsH - height);

            let x = 0;
            let y = 0;
            let attempts = 0;

            while (attempts < 300) {

                x = Math.random() * maxX;
                y = Math.random() * maxY;

                const candidate = {
                    x,
                    y,
                    w: width,
                    h: height
                };

                if (!placed.some(p => rectsOverlap(candidate, p))) {
                    break;
                }

                attempts++;
            }

            placed.push({
                x,
                y,
                w: width,
                h: height
            });

            const wrap = document.createElement("a");
            wrap.href = game.link;
            wrap.target = "_blank";
            wrap.className = "artwork-wrap";

            wrap.style.left = x + "px";
            wrap.style.top = y + "px";
            wrap.style.width = width + "px";

            wrap.innerHTML = `
                <div class="artwork-title">${game.title}</div>

                <img
                    src="${game.image}"
                    class="artwork"
                >

                <div class="game-info">
                    <div>role :: ${game.role}</div>
                    <div>genre :: ${game.genre}</div>
                    <div>status :: ${game.status}</div>
                </div>
            `;

            gallery.appendChild(wrap);
        });
    });
}