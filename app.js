const search = document.getElementById('searchValue');
const submit = document.getElementById('submit');
const result = document.getElementById('fancy-result');
const lyricsArea = document.getElementById("lyrics");
const api = 'https://api.lyrics.ovh';

submit.addEventListener('click', function () {
    const searchValue = search.value;
    result.style.display = 'block';
	searchSong(searchValue);
});

async function searchSong(searchValue) {
	const res = await fetch(`${api}/suggest/${searchValue}`);
	const data = await res.json();
	console.log(data);
	result.innerHTML = `
            ${data.data.slice(0,10).map(song => 
                `
                <div class="single-result row align-items-center my-3 p-3" >
                <div class="col-md-9">
                     <h3 class="lyrics-name">${song.title}</h3>
                     <p class="author lead">Album by <span>${song.artist.name}</span></p>
                </div>
                 <div class="col-md-3 text-md-right text-center">
                    <button data-artist="${song.artist.name}" data-song="${song.title}" class="btn btn-success">Get Lyrics</button>
                 </div>
                 </div>`
            ).join('')}
           
        `;
}


result.addEventListener('click', function(e){
    const targetEL = e.target;
    if(targetEL.tagName === 'BUTTON'){
        const artistName = targetEL.getAttribute('data-artist');
        const songTitle = targetEL.getAttribute('data-song');
        getLyrics(artistName, songTitle);
    }
})
    
async function getLyrics(artist, title){
    const res = await fetch(`${api}/v1/${artist}/${title}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    document.getElementById("songHeader").innerHTML = `${title} -- ${artist}`;
    document.getElementById("lyrics").innerHTML = lyrics;
    result.style.display = 'none';
}