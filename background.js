const baseUrl = 'https://www3.animeflv.net/ver/';
const currentUrl = window.location.href;

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const linkToJson = (link) => {
    let episode = link.split('-');
    episode = episode[episode.length - 1];
    let animeName = link.split('/ver/')[1]
    animeName = animeName.split('-');
    animeName = animeName.slice(0, -1).join(' ');
    animeName = capitalizeFirstLetter(animeName);

    return {
        title: animeName,
        link,
        episode,
    };
};

const organizeLinks = (links, newAnime) => {
    let organizedLinks = links;

    if (links.length > 0) {
        organizedLinks = removeAnimeLink(organizedLinks, newAnime.title);
        organizedLinks.unshift(newAnime);
    }

    return organizedLinks
}

const saveAnimeLink = (data) => {
    let animeLinks = getAnimeData();
    animeLinks.push(data);
    const organizedLinks = organizeLinks(animeLinks, data);
    localStorage.setItem('animeLinks', JSON.stringify(organizedLinks));
};

const updateAnimeLink = (data) => {
    let animeLinks = getAnimeData();
    const index = animeLinks.findIndex((link) => link.title === data.title);
    if (index !== -1) {
        animeLinks[index] = data;
        const organizedLinks = organizeLinks(animeLinks, data);
        localStorage.setItem('animeLinks', JSON.stringify(organizedLinks));
    }
};

const removeAnimeLink = (animeLinks, title) => {
    return animeLinks.filter((link, i) => link.title != title)
}

const existAnimeLink = (animeTitle) => {
    return new Promise((resolve) => {
        const animeLinks = getAnimeData();
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
        enviarRespuesta({
            animesData: datos,
            isInAnimeFlvSite: currentUrl.includes(baseUrl),
        });
    }

    if (mensaje.type === "removeAnime") {
        let animeLinks = getAnimeData();
        animeLinks = removeAnimeLink(animeLinks, mensaje.title);
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
