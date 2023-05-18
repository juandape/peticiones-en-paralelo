import { useEffect, useState } from 'react';

async function getEpisodes() {
  const response = await fetch('https://rickandmortyapi.com/api/episode/');
  const data = await response.json();
  return data.results;
}

async function getCharacters(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getData() {
  const episodes = await getEpisodes();

  const charEpisodes = episodes.reduce((acum, item) => {
    return [...acum, ...item.characters.slice(0, 10)];
  }, []);

  const chPromise = charEpisodes.map((url) => {
    return getCharacters(url);
  });
  const result = await Promise.all(chPromise);

  const data = episodes.map((episode) => {
    return {
      title: `${episode.name} - ${episode.episode}`,
      dateToAir: episode.air_date,
      characters: episode.characters.slice(0, 10).map((url) => {
        return result.find((item) => item.url === url);
      }),
    };
  });
  return data;
}

function Parallel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });
  }, []);

console.log(data)

  return (
    <div>
      <h1>Rick and Morty</h1>
      <ul>
        {data.map((chapter) => (
          <li key={chapter.id}>
            <h2>
            {chapter.title}
            </h2>
            <h3>Air Date: {chapter.dateToAir}</h3>
            <h3>Characters:</h3>
            <ul>
              {chapter.characters.map((char) => (
                <li>{char.name} - {char.species} - {char.status}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Parallel;
