const baseUrl = 'https://www3.animeflv.net/ver/';
const currentUrl = window.location.href;

const linkToJson = (link) => {
    let episode = link.split('-');
    episode = episode[episode.length - 1];
    let animeName = link.split('/ver/')[1]
    animeName = animeName.split('-');
    animeName = animeName.slice(0, -1).join(' ');

    return {
        title: animeName,
        link,
        episode,
    };
};

const saveAnimeLink = (data) => {
    let animeLinks = JSON.parse(localStorage.getItem('animeLinks')) || [];
    animeLinks.push(data);
    localStorage.setItem('animeLinks', JSON.stringify(animeLinks));
};

const updateAnimeLink = (data) => {
    let animeLinks = JSON.parse(localStorage.getItem('animeLinks')) || [];
    const index = animeLinks.findIndex((link) => link.title === data.title);
    if (index !== -1) {
        animeLinks[index] = data;
        localStorage.setItem('animeLinks', JSON.stringify(animeLinks));
    }
};

const existAnimeLink = (animeTitle) => {
    return new Promise((resolve) => {
        const animeLinks = JSON.parse(localStorage.getItem('animeLinks')) || [];
        const exists = animeLinks.some((link) => link.title === animeTitle);
        resolve(exists);
    });
};

const getAnimeData = () => {
    const animeLinks = JSON.parse(localStorage.getItem('animeLinks')) || [];
    return animeLinks;
};


chrome.runtime.onMessage.addListener((mensaje, sender, enviarRespuesta) => {
    if (mensaje.type === "getAnimeData") {
        const datos = getAnimeData();
        enviarRespuesta(datos);
    }

    if (mensaje.type === "removeAnime") {
        let animeLinks = JSON.parse(localStorage.getItem('animeLinks')) || [];
        animeLinks = animeLinks.filter((link) => link.link !== mensaje.url);
        localStorage.setItem('animeLinks', JSON.stringify(animeLinks));
        enviarRespuesta({ status: 'success' });
    }

    return true;
});


if (currentUrl && currentUrl.includes(baseUrl)) {
    const animeData = linkToJson(currentUrl);
    const exist = existAnimeLink(animeData.title);


    exist.then((exists) => {
        if (!exists) {
            saveAnimeLink(animeData);
        } else {
            updateAnimeLink(animeData);
        }
    });
}
