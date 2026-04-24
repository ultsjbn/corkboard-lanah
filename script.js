let music = document.querySelector("#myMusic");
let poster = document.querySelector("#poster");
let name = document.querySelector(".name");
let singer = document.querySelector(".singer");
let date = document.querySelector(".date");

let back = document.querySelector(".fa-fast-backward");
let next = document.querySelector(".fa-fast-forward");
let ppBtn = document.querySelector(".play-pause-btn");

let progress = document.querySelector(".progress");
let currentTiming = document.querySelector(".current-time");
let durationTime = document.querySelector(".duration-time");

const songs = [
  {
    name: "But I Don't Mind",
    singer: "Kyl Aries",
    year: "2020",
    poster: "img/cuties1.jpg",
    audio: "https://files.catbox.moe/reqe54.mp3"
  },
  {
    name: "Pictures of Venus",
    singer: "Aldehyde",
    year: "2024",
    poster: "https://files.catbox.moe/gnwfd0.webp",
    audio: "https://files.catbox.moe/mdpf3v.mp3"
  },
  {
    name: "LEASE",
    singer: "Takeshi Abo",
    year: "2003",
    poster: "https://files.catbox.moe/sctr6j.jpg",
    audio: "https://files.catbox.moe/rdnozd.mp3"
  },
  {
    name: "Dinner is Not Over",
    singer: "Jack Stauber",
    year: "2020",
    poster: "https://files.catbox.moe/ngx2ng.jpg",
    audio: "https://files.catbox.moe/nbfxps.mp3"
  },
  {
    name: "Dramatic",
    singer: "Mass of the Fermenting Dregs",
    year: "2022",
    poster: "https://files.catbox.moe/yzpmql.jpg",
    audio: "https://files.catbox.moe/hvlg1q.mp3"
  }
];

let isPlaying = false;

// functions to play and pause music
const playAudio = () => {
  isPlaying = true;
  music.play();
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
  name.innerText = song.name;
  singer.innerText = song.singer;
  date.innerText = song.year;
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
  loadSongs(songs[songIndex]);

  const photobooth = document.querySelector("#photobooth");
  const overlay = document.querySelector("#photobooth-overlay");

  photobooth.addEventListener("click", () => {
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
  });
});
