// Elements
const image = getElem('img');
const title = getElem('#title');
const artist = getElem('#artist');
const music = getElem('audio');
const progressContainer = getElem('#progress-container');
const progress = getElem('#progress');
const currentTimeEl = getElem('#current-time');
const durationEl = getElem('#duration');
const prevBtn = getElem('#prev');
const playBtn = getElem('#play');
const nextBtn = getElem('#next');

// Counter for current song
let currentSong = 0;
const apiUrl = 'https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm';
let songsArray = [];




// Music
const songs = [{
        name: 'jacinto-1',
        displayName: 'Electric Chill Machine',
        artist: 'Jacinto Design',
    },
    {
        name: 'jacinto-2',
        displayName: 'Seven nation Army (Remix)',
        artist: 'Jacinto Design',
    },
    {
        name: 'jacinto-3',
        displayName: 'Goodnight, Disco Queen',
        artist: 'Jacinto Design',
    },
    {
        name: 'metric-1',
        displayName: 'Front Row (Remix)',
        artist: 'Metric/Jacinto Design',
    },
];

// Check if song is playing
let isPlaying = false;

// Function to get elements by id
function getElem(id) {
    return document.querySelector(id);
}


//fetch songs
async function fetchSongs(url) {
    let songsArr = [];
    try {
        const response = await fetch(url);
        songsArr = await response.json();


    } catch (error) {
        console.log('Error fetching data :' + error);
    }

    songsArray = songsArr.tracks;
    return (songsArr.tracks);



}

// Function to Play Song
function playSong() {
    isPlaying = true;
    console.log('play song');
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

// Function to pause Song
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}



// Update DOM
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;


}

// Update DOM
function loadSongFromApiData(song) {
    if (song) {
        console.log(song);

        title.textContent = song.name;
        artist.textContent = song.artistName;
        music.src = song.previewURL;
        image.src = `http://direct.rhapsody.com/imageserver/v2/albums/${song.albumId}/images/300x300.jpg`;



    }


}

// Function to update progress
function updateProgress(e) {
    if (isPlaying) {
        const {
            duration,
            currentTime
        } = e.srcElement;

        // Update Progress Bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Calculate Display for the duration
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }

        // Delay switching the duration element to avoid NaN
        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }

        // Calculate Display for the current time
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }

        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

// Function to set the time of the song by clicking the progress bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const {
        duration
    } = music;
    music.currentTime = (clickX / width) * duration;
}

// Function for next song
function nextSong() {
    console.log(songsArray);
    currentSong < songsArray.length - 1 ? currentSong++ : (currentSong = 0);

    //currentSong < songs.length - 1 ? currentSong++ : (currentSong = 0);
    //loadSong(songs[currentSong]);
    loadSongFromApiData(songsArray[currentSong]);
    playSong();
}

// function for previous song
function previousSong() {
    currentSong <= 0 ? (currentSong = songsArray.length - 1) : currentSong--;

    //currentSong <= 0 ? (currentSong = songs.length - 1) : currentSong--;
    //loadSong(songs[currentSong]);
    loadSongFromApiData(songsArray[currentSong]);
    playSong();
}

// On Load - Select First Song
//loadSong(songs[currentSong]);
songsArray = fetchSongs(apiUrl).then(songsArray => {

    loadSongFromApiData(songsArray[0]);



});


;




// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Skip event listener
nextBtn.addEventListener('click', nextSong);

// Previous event listener
prevBtn.addEventListener('click', previousSong);

// Update progress bar
music.addEventListener('timeupdate', updateProgress);

// Play the next song when the song ends
music.addEventListener('ended', nextSong);

// Click on progress bar to search through the song
progressContainer.addEventListener('click', setProgressBar);