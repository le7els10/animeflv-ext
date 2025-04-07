const animeListContainer = document.getElementById('anime-list');

const removeAnime = async (link) => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { type: "removeAnime", url: link }, () => {
        loadAnimeList();
    })

}

const loadAnimeList = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["background.js"]
    }, () => {
        chrome.tabs.sendMessage(tab.id, { type: "getAnimeData" }, (animesData) => {
            if (animesData == null) return

            animeListContainer.innerHTML = ''; // Clear the container before loading new data

            animesData.forEach((anime) => {
                const animeItem = document.createElement('div');
                animeItem.className = 'anime-item';
                animeItem.innerHTML = `
                 <div class="list-item">
                    <a class="list-item-link" href="${anime.link}" target="_blank">
                        ${anime.title}
                        <span> Capitulo ${anime.episode} </span>
                    </a>
                    <div class="list-item-delete" link="${anime.link}">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            `;
                animeListContainer.appendChild(animeItem);
            });

            const deleteButtons = document.querySelectorAll('.list-item-delete');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    const link = event.currentTarget.getAttribute('link');
                    removeAnime(link);
                });
            });
        });
    })
}

loadAnimeList();