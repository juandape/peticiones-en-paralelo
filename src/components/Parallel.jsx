import { useEffect, useState } from 'react';


// hago la peticion de los episodios

async function getEpisodes() {
  const response = await fetch('https://rickandmortyapi.com/api/episode/');
  const data = await response.json();
  return data.results;
}

//hago la peticion de la url de los capitulos de los personajes
async function getCharacters(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


//solicito la data
async function getInfo() {
  const episodes = await getEpisodes();

  //filtro los episodios para que cada uno me muestre los 10 primeros personajes
  const charEpisodes = episodes.reduce((acum, item) => {
    return [...acum, ...item.characters.slice(0, 10)];
  }, []);
  console.log(charEpisodes)

//obtengo las url de los capitulos donde aparece cada personaje
  const chPromise = charEpisodes.map((url) => {
    return getCharacters(url);
  });

  //hago la solicitud en paralelo
  const result = await Promise.all(chPromise);

  //obtendo la data y la recorro
  const data = episodes.map((episode) => {
    return {
      title: `${episode.name} - ${episode.episode}`,
      dateToAir: episode.air_date,
      //filtro de la url de los personajes y la comparo con la de los episodios
      characters: episode.characters.slice(0, 10).map((url) => {
        return result.find((item) => item.url === url);
      }),
    };
  });
  return data;
}

function Parallel() {
  //variable de estado
  const [data, setData] = useState([]);

  //lo uso para solicitar solo una vez los datos
  useEffect(() => {
    getInfo().then((data) => {
      setData(data);
    });
  }, []);

  //se pinta en el explorador la info solicitada
  return (
    <div>
      <h1>Rick and Morty Parallel Fetch</h1>
      <ul>
        {data.map((chapter) => (
          <li key={chapter.id}>
            <h2>{chapter.title}</h2>
            <h3>Air Date: {chapter.dateToAir}</h3>
            <h3>Characters:</h3>
            <ul>
              {chapter.characters.map((char) => (
                <li key={char.id}>
                  {char.name} - {char.species} - {char.status}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Parallel;
