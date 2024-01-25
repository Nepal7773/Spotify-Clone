console.log('Hello World!');
let currentSong = new Audio();
let songs;
let curFolder;

const playMusic = (track, pause = false) => {

    currentSong.src = `${curFolder}/` + decodeURI(track);
    if (!pause) {
        currentSong.play();
        play.src = "./img/pause.svg";
    }

    // Update the song name and time
    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = '0:00 / 0:00';
}

async function getSongs(folder) {
    curFolder = folder;
    let a = await fetch(`https://nepal7773.github.io/Spotify-Clone/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs);

    // Show all the song in the list
    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUL.innerHTML = ""; // Clear the list
    for (const song of songs) {
        songUL.innerHTML += `<li>
        <img class="invert"  src="./img/music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll('%20', " ")} </div>
            <div>${curFolder.split('/')[1]}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert"  src="./img/play.svg" alt="">
        </div>
     </li>`
    }

    // Play the song when clicked
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {

        e.addEventListener('click', element => {
            // console.log(e);
            let songName = e.querySelector('.info').firstElementChild.innerHTML;
            console.log(songName);
            playMusic(songName.trim());

        });
    });

    return songs;
}

async function displayAlbums() {

    let a = await fetch(`https://nepal7773.github.io/Spotify-Clone/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div);
    let cardContainer = document.querySelector('.cardContainer');
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        // console.log(element.href);
        if (element.href.includes('/songs/')) {
            let folder = element.href.split('/songs/')[1];
            // console.log(folder);
            // Get the metadata of the folder

            let a = await fetch(`https://nepal7773.github.io/Spotify-Clone/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response);
            cardContainer.innerHTML += `<div data-folder=${folder} class="card">
            <div class="play">
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#00FF00" />
                    <g transform="translate(9, 9)">
                        <path d="M6,4.5L14,9L6,13.5V4.5Z" fill="#141B34" />
                    </g>
                </svg>
            </div>
            <img  src="./songs/${folder}/cover.jfif" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div> `
        }
    };

    //Load song when click on card
    Array.from(document.getElementsByClassName("card")).forEach(item => {

        item.addEventListener("click", async (e) => {
            // console.log('clicked');
            // console.log(e.currentTarget, e.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${e.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });

}

async function main() {
    //Get list of all the songs
    await getSongs("songs/Arijit");
    playMusic(songs[0], true);

    // display Albums
    displayAlbums();

    // Attach event listener to the play button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./img/play.svg";
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.keyCode == 32) {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "./img/pause.svg";
            } else {
                currentSong.pause();
                play.src = "./img/play.svg";
            }
        }
    });

    // Listen for timeupdate event on the audio element
    currentSong.addEventListener('timeupdate', () => {
        let time = currentSong.currentTime;
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        document.querySelector('.songtime').innerHTML = minutes + ':' + seconds + ' / ' + Math.floor(currentSong.duration / 60) + ':' + String(Math.floor(currentSong.duration % 60)).padStart(2, '0');
        if (currentSong.ended) {
            let index = songs.indexOf(currentSong.src.split(`/${curFolder}/`)[1]);
            // play.src = "./img/play.svg";
            playMusic(songs[index + 1]);
        }
        document.querySelector('.circle').style.left = (time / currentSong.duration) * 100 + '%';
    });

    // Listen for click event on the seekbar
    document.querySelector('.seekbar').addEventListener('click', e => {
        // console.log(e.target.getBoundingClientRect().width, e.offsetX);
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = (percent / 100) * currentSong.duration;
    });

    // Add event listener for hamburger menu
    document.querySelector('.hamburger').addEventListener('click', () => {
        console.log('clicked');
        document.querySelector('.left').style.left = '0';
    });

    // Add event listener for close button
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });

    // Add event listener for previous button
    previous.addEventListener('click', () => {
        // console.log('previous');
        // console.log(songs);
        // console.log(songs.indexOf(currentSong.src.split('/songs/')[1]));
        let index = songs.indexOf(currentSong.src.split(`/${curFolder}/`)[1]);
        if (index == 0) {
            index = songs.length - 1;
        } else {
            index--;
        }
        // console.log(index);
        playMusic(songs[index]);
    });

    // Add event listener for next button
    next.addEventListener('click', () => {
        console.log('next button');
        console.log(songs);
        console.log(songs.indexOf(currentSong.src.split(`/${curFolder}/`)[1]));
        let index = songs.indexOf(currentSong.src.split(`/${curFolder}/`)[1]);
        if (index == songs.length - 1) {
            index = 0;
        } else {
            index++;
        }
        console.log(index);
        playMusic(songs[index]);
    });

    // Add event listener for volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume == 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg")
        } else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    });

    // Add event listener for volume img
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.src.includes("mute.svg")) {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        } else {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }

    });



}

main();