const animeListContainer = document.getElementById('anime-list');

const removeAnime = async (index) => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { type: "removeAnime", index }, () => {
        loadAnimeList();
    })

}

const generateHtmlListItem = (anime) => {
    const animeItem = document.createElement('div');
    animeItem.className = 'anime-item';
    animeItem.innerHTML = `
        <div class="list-item">
            <a class="list-item-link" href="${anime.link}" target="_blank">
                ${anime.title}
                <span> Capitulo ${anime.episode} </span>
            </a>
            <div class="list-item-delete" index="${anime.index}">
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
    `;

    return animeItem
}

const loadAnimeList = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["background.js"]
    }, () => {
        chrome.tabs.sendMessage(tab.id, { type: "getAnimeData" }, (data) => {
            if (data == null) return
            const { animesData, isInAnimeFlvSite } = data;
            const emptyMessage = isInAnimeFlvSite ? 'No hay animes guardados' : 'Debe usar esta extensión en <a href="https://www3.animeflv.net/" target="_blank" >animeflv.net</a> únicamente';

            animeListContainer.innerHTML = ''; // Clear the container before loading new data

            if (animesData.length === 0) {
                animeListContainer.innerHTML = `<div class="list-item list-item--empty">${emptyMessage}</div>`;
                return;
            }

            animesData.forEach((anime, index) => {
                anime = {
                    ...anime,
                    index
                }
                const animeItem = generateHtmlListItem(anime);
                animeListContainer.appendChild(animeItem);
            });

            const deleteButtons = document.querySelectorAll('.list-item-delete');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    const index = event.currentTarget.getAttribute('index');
                    removeAnime(index);
                });
            });
        });
    })
}

loadAnimeList();