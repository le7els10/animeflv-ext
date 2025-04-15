const supportedBaseUrls = [
    'https://www3.animeflv.net/ver/',
    'https://jkanime.net/'
]

const ANIMEFLV = 0
const JKANIME = 1
const currentUrl = window.location.href;

const getUrlFrom = () => {
    const urlFrom = supportedBaseUrls.findIndex((baseUrl) => currentUrl.includes(baseUrl));
    if (urlFrom == -1) return null

    return urlFrom
}

const isSupportedUrl = () => {
    let isSupported = getUrlFrom();

    if (isSupported == null) return false

    switch (isSupported) {

        case ANIMEFLV:
            return true;
            break;

        case JKANIME:
            let isValidUrl = currentUrl.split(supportedBaseUrls[1]);
            let JKAnimeUrl = isValidUrl[1];

            if (JKAnimeUrl.trim().length == 0) return false
            JKAnimeUrl = JKAnimeUrl.split('/');

            if (JKAnimeUrl[1].trim().length == 0) return false

            return true
            break;

        default:
            return false
            break;
    }
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const linkToJson = (link) => {
    let episode, animeName

    switch (getUrlFrom()) {
        case ANIMEFLV:
            episode = link.split('-');
            episode = episode[episode.length - 1];
            animeName = link.split('/ver/')[1]
            animeName = animeName.split('-');
            animeName = animeName.slice(0, -1).join(' ');
            animeName = capitalizeFirstLetter(animeName);

            return {
                title: animeName,
                link,
                episode,
            };
            break;

        case JKANIME:
            episode = link.split('/');
            episode = episode[episode.length - 2];

            animeName = link.replace(supportedBaseUrls[JKANIME], '');
            animeName = animeName.split('/')[0];
            animeName = animeName.replaceAll('-', ' ');

            animeName = capitalizeFirstLetter(animeName);

            return {
                title: animeName,
                link,
                episode,
            };
            break
    }


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
    return organizedLinks;
};

const updateAnimeLink = (data) => {
    let animeLinks = getAnimeData();
    const index = animeLinks.findIndex((link) => link.title === data.title);
    if (index !== -1) {
        animeLinks[index] = data;
        const organizedLinks = organizeLinks(animeLinks, data);
        localStorage.setItem('animeLinks', JSON.stringify(organizedLinks));
        return organizedLinks;
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
            isUrlAllowed: getUrlFrom() !== null,
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


if (currentUrl && isSupportedUrl()) {
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