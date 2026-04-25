let music = document.querySelector("#myMusic");
let poster = document.querySelector("#poster");
let month = document.querySelector(".month");
let songtitle = document.querySelector(".songtitle");

let back = document.querySelector(".fa-fast-backward");
let next = document.querySelector(".fa-fast-forward");
let ppBtn = document.querySelector(".play-pause-btn");

let progress = document.querySelector(".progress");
let currentTiming = document.querySelector(".current-time");
let durationTime = document.querySelector(".duration-time");

const songs = [
    {
        month: "October",
        songtitle: "Bags - Clairo",
        poster: "img/oct-cover.jpeg",
        audio: "audio/oct-bags.mp3"
    },
    {
        month: "November",
        songtitle: "Cherry Flavoured - The Neighbourhood",
        poster: "img/nov-cover.jpeg",
        audio: "audio/nov-cherryflavoured.mp3"
    },
    {
        month: "December",
        songtitle: "Falling Autumn - alayna",
        poster: "img/dec-cover.jpeg",
        audio: "audio/dec-fallingautumn.mp3"
    },
    {
        month: "January",
        songtitle: "So High School - Taylor Swift",
        poster: "img/jan-cover.jpeg",
        audio: "audio/jan-sohighschool.mp3"
    },
    {
        month: "February",
        songtitle: "Adorable - Loop",
        poster: "img/feb-cover.jpeg",
        audio: "audio/feb-adorable.mp3"
    },
    {
        month: "March",
        songtitle: "(You) On My Arm) - Leith Ross",
        poster: "img/mar-cover.jpeg",
        audio: "audio/march-youonmyarm.mp3"
    },
    {
        month: "April",
        songtitle: "North - Clairo",
        poster: "img/apr-cover.jpeg",
        audio: "audio/apr-north.mp3"
    },
];

let isPlaying = false;

// functions to play and pause music
const playAudio = () => {
    isPlaying = true;
    music.play().catch(() => { isPlaying = false; });
};

const pauseAudio = () => {
    isPlaying = false;
    music.pause();
};

// event listener for play/pause button
ppBtn.addEventListener("click", () => {
    const playIcon = ppBtn.querySelector(".fa-play");
    const pauseIcon = ppBtn.querySelector(".fa-pause");
    if (isPlaying) {
        pauseAudio();
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
    } else {
        playAudio();
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
    }
});

// function to load song details into the DOM
const loadSongs = (song) => {
    month.innerText = song.month;
    songtitle.innerText = song.songtitle;
    poster.src = song.poster;
    music.src = song.audio;
};

// functions to navigate to the next and previous songs
let songIndex = 0;
const nextSong = () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSongs(songs[songIndex]);
    playAudio();
};

const prevSong = () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSongs(songs[songIndex]);
    playAudio();
};

next.addEventListener("click", nextSong);
back.addEventListener("click", prevSong);

// event listener to update progress bar and time displays
music.addEventListener("timeupdate", (event) => {
    const { currentTime, duration } = event.srcElement;
    let current = (currentTime / duration) * 100;
    progress.style.width = current + "%";

    let min_duration = Math.floor(duration / 60);
    let sec_duration = Math.floor(duration % 60);
    durationTime.innerText = duration
        ? `${min_duration}:${sec_duration < 10 ? "0" + sec_duration : sec_duration}`
        : "0:00";

    let min_current = Math.floor(currentTime / 60);
    let sec_current = Math.floor(currentTime % 60);
    currentTiming.innerText = `${min_current}:${
        sec_current < 10 ? "0" + sec_current : sec_current
    }`;
});

music.addEventListener("ended", nextSong);

window.addEventListener("load", () => {
    const loader = document.querySelector("#loader");
    loader.classList.add("done");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });

    loadSongs(songs[songIndex]);
    playAudio();


    // zoom system
    const zoomOverlay = document.querySelector("#zoom-overlay");
    let zoomedEl = null;
    let zoomedElParent = null; // stacking-context ancestor that needs elevating

    const zoomIn = (el) => {
        // re-enable transition in case the drag system disabled it
        el.style.transition = "";
        void el.offsetWidth; // force reflow so the transition is active before we set transform

        const rect = el.getBoundingClientRect();
        const vpW = window.innerWidth;
        const vpH = window.innerHeight;
        const scale = Math.min(
            (vpW * 0.85) / rect.width,
            (vpH * 0.85) / rect.height,
            2.5
        );
        const dx = vpW / 2 - (rect.left + rect.width / 2);
        const dy = vpH / 2 - (rect.top + rect.height / 2);

        el.style.rotate = "0deg";
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        el.style.zIndex = "501";

        // if el is inside a stacking-context ancestor (filter/transform), elevate it
        let ancestor = el.parentElement;
        while (ancestor && ancestor !== document.body) {
            const cs = getComputedStyle(ancestor);
            if (cs.filter !== "none" || (cs.transform !== "none" && cs.transform !== "")) {
                ancestor._savedZIndex = ancestor.style.zIndex;
                ancestor.style.zIndex = "501";
                zoomedElParent = ancestor;
                break;
            }
            ancestor = ancestor.parentElement;
        }

        zoomOverlay.classList.add("active");
        zoomedEl = el;
    };

    const zoomOut = () => {
        if (!zoomedEl) return;
        zoomedEl.style.rotate = "";
        zoomedEl.style.transform = "";
        zoomedEl.style.zIndex = "";
        if (zoomedElParent) {
            zoomedElParent.style.zIndex = zoomedElParent._savedZIndex || "";
            zoomedElParent = null;
        }
        zoomOverlay.classList.remove("active");
        zoomedEl = null;
    };

    [
        document.querySelector(".ipod-container"),
        document.querySelector(".receiptify"),
        document.querySelector(".letter"),
        document.querySelector(".note-2"),
        document.querySelector(".chiikawa-keychain"),
        document.querySelector("#hachikaawa"),
        document.querySelector(".uno-reverse"),
        document.querySelector("#polaroid"),
        document.querySelector(".washi"),
        document.querySelector("#photobooth"),
        document.querySelector("#bracelet"),
        document.querySelector("#a-patch"),
        document.querySelector("#b-patch"),
    ].forEach(el => {
        el.classList.add("zoomable");
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (zoomedEl === el) {
                zoomOut();
            } else {
                if (zoomedEl) zoomOut();
                zoomIn(el);
            }
        });
    });

    zoomOverlay.addEventListener("click", zoomOut);

    // prevent ipod controls from bubbling up and triggering zoom toggle
    [ppBtn, back, next].forEach(ctrl => {
        ctrl.addEventListener("click", e => e.stopPropagation());
    });

    // dragging system
    let dragEl = null, dragStartX, dragStartY, dragStartL, dragStartT, dragMoved;

    document.addEventListener("mousemove", (e) => {
        if (!dragEl) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true;
        if (dragMoved) {
            dragEl.style.left = (dragStartL + dx) + "px";
            dragEl.style.top  = (dragStartT + dy) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (!dragEl) return;
        dragEl.style.transition = "";
        dragEl.style.zIndex = dragEl._savedZIndex || "";
        if (dragMoved) {
            // block the next click
            dragEl.addEventListener("click", e => e.stopPropagation(), { capture: true, once: true });
        }
        dragEl = null;
    });

    const makeDraggable = (el) => {
        el.addEventListener("mousedown", (e) => {
            if (zoomedEl) return; // if zoomed in not draggable
            if (e.button !== 0) return;
            e.stopPropagation();
            dragEl = el;
            dragMoved = false;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragStartL = el.offsetLeft;
            dragStartT = el.offsetTop;
            el._savedZIndex  = el.style.zIndex;
            el.style.zIndex  = "502";
            el.style.transition = "none";
        });
    };

    [
        document.querySelector(".inner-blue-poster"),
        document.querySelector(".receiptify"),
        document.querySelector(".uno-reverse"),
        document.querySelector(".chiikawa-keychain"),
        document.querySelector("#a-patch"),
        document.querySelector("#b-patch"),
        document.querySelector("#heart-clip"),
        document.querySelector("#bracelet"),
        document.querySelector("#camera-body"),
        document.querySelector(".letter"),
        document.querySelector("#hachikaawa"),
        document.querySelector(".ipod-container"),
        document.querySelector(".note-1"),
        document.querySelector(".note-2"),
        document.querySelector("#kuromi-2"),
        document.querySelector("#random-1"),
        document.querySelector("#camera-photo-gallery"),
        document.querySelector("#polaroid"),
        document.querySelector(".washi"),
        document.querySelector("#photobooth"),
    ].filter(Boolean).forEach(makeDraggable);

    // embedded camera / live viewfinder
    const cameraBody    = document.querySelector("#camera-body");
    const cameraFeed    = document.querySelector("#camera-feed");
    const cameraFlash   = document.querySelector("#camera-screen-flash");
    const cameraShutter = document.querySelector("#camera-shutter");
    const photoGallery  = document.querySelector("#camera-photo-gallery");
    const stripSaveBtn  = document.querySelector("#strip-save-btn");

    let camStream = null;

    cameraBody.classList.add("zoomable");

    const startCamera = async () => {
        try {
            camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            cameraFeed.srcObject = camStream;
            cameraBody.classList.add("on");
            if (zoomedEl) zoomOut();
            zoomIn(cameraBody);
        } catch {
            document.querySelector("#camera-hint").textContent = "access denied :(";
        }
    };

    const stopCamera = () => {
        if (camStream) {
            camStream.getTracks().forEach(t => t.stop());
            camStream = null;
        }
        cameraFeed.srcObject = null;
        cameraBody.classList.remove("on");
        zoomOut();
    };

    const snap = () => {
        cameraFlash.classList.add("flash");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            cameraFlash.classList.remove("flash");
        }));

        const canvas = document.createElement("canvas");
        canvas.width  = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(cameraFeed, -canvas.width, 0);
        ctx.restore();

        const polaroid = document.createElement("div");
        polaroid.className = "board-polaroid";
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/jpeg", 0.88);
        polaroid.appendChild(img);
        photoGallery.insertBefore(polaroid, stripSaveBtn);

        const shots = photoGallery.querySelectorAll(".board-polaroid");
        if (shots.length > 3) shots[0].remove();

        stripSaveBtn.style.display = "block";
    };

    const saveStrip = () => {
        const shots = [...photoGallery.querySelectorAll(".board-polaroid img")];
        if (!shots.length) return;
        const pw = 400, ph = 300, gap = 10, pad = 16;
        const strip = document.createElement("canvas");
        strip.width  = pw + pad * 2;
        strip.height = (ph + gap) * shots.length + gap + pad * 2;
        const ctx = strip.getContext("2d");
        ctx.fillStyle = "#fff8f8";
        ctx.fillRect(0, 0, strip.width, strip.height);
        let done = 0;
        shots.forEach((imgEl, i) => {
            const tmp = new Image();
            tmp.onload = () => {
                ctx.drawImage(tmp, pad, pad + i * (ph + gap), pw, ph);
                if (++done === shots.length) {
                    const a = document.createElement("a");
                    a.download = "photobooth-strip.jpg";
                    a.href = strip.toDataURL("image/jpeg", 0.92);
                    a.click();
                }
            };
            tmp.src = imgEl.src;
        });
    };

    cameraBody.addEventListener("click", (e) => {
        e.stopPropagation();
        if (cameraBody.classList.contains("on")) stopCamera();
        else startCamera();
    });

    cameraShutter.addEventListener("click", (e) => {
        e.stopPropagation();
        if (camStream) snap();
    });

    stripSaveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveStrip();
    });
});
