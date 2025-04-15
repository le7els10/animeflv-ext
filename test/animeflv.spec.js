const animeLinks = [
    {
        "title": "One piece tv",
        "link": "https://www3.animeflv.net/ver/one-piece-tv-1125",
        "episode": "999"
    },
    {
        "title": "Kijin gentoushou",
        "link": "https://www3.animeflv.net/ver/kijin-gentoushou-2",
        "episode": "2"
    },
    {
        "title": "86 2nd season",
        "link": "https://www3.animeflv.net/ver/86-2nd-season-1",
        "episode": "1"
    },
    {
        "title": "Chotto dake ai ga omoi dark elf ga isekai kara oikaketekita",
        "link": "https://www3.animeflv.net/ver/chotto-dake-ai-ga-omoi-dark-elf-ga-isekai-kara-oikaketekita-2",
        "episode": "2"
    },
    {
        "title": "Shokugeki no souma san no sara",
        "link": "https://www3.animeflv.net/ver/shokugeki-no-souma-san-no-sara-1",
        "episode": "1"
    }
]

const animeTesting = {
    "title": "One piece tv",
    "link": "https://www3.animeflv.net/ver/one-piece-tv-1125",
    "episode": "1125"
}

describe('background.js', () => {
    it('Should save an anime link', () => {
        removeAnimeLink(animeLinks, animeTesting.title);
        const linksSaved = saveAnimeLink(animeTesting);
        const foundAnime = linksSaved.find((link) => link.title === animeTesting.title);
        expect(foundAnime).toBeDefined();
    })

    it('Should update an anime link', () => {
        const linksUpdated = updateAnimeLink(animeTesting);
        const foundAnime = linksUpdated.find((link) => link.title === animeTesting.title);
        expect(foundAnime.episode).toBe(animeTesting.episode);
    })

    it('Should remove an anime link', () => {
        const linksCleaned = removeAnimeLink(animeLinks, animeTesting.title);
        const foundAnime = linksCleaned.find((link) => link.title === animeTesting.title);
        expect(foundAnime).toBeUndefined();
    });

    it('Should get anime data', () => {
        const animeData = getAnimeData();

        expect(animeData).toBeDefined();
    })

    it('Should be an array anime data', () => {
        const animeData = getAnimeData();

        expect(Array.isArray(animeData)).toBe(true);
    });


    it('Should check if an anime link exists', async () => {
        const exists = await existAnimeLink(animeTesting.title);
        expect(exists).toBe(true);
    })

    it('Should set first the anime given', () => {
        const animesOrganized = organizeLinks(animeLinks, animeTesting);
        const firstAnime = animesOrganized[0];
        expect(firstAnime.title).toBe(animeTesting.title);
    })

});
