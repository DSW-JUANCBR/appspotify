import React, { useState, useEffect } from 'react';
import Dropdown from './complementos/Dropdown';
import Listbox from './complementos/Listbox';
import Detail from './complementos/Detail';
import { Credentials } from './complementos/Credentials';
import axios from 'axios';

const App = () => {

  //declaraciones para conexión.

  const spotify = Credentials();
  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({ selectedGenre: '', listOfGenresFromAPI: [] });
  const [playlist, setPlaylist] = useState({ selectedPlaylist: '', listOfPlaylistFromAPI: [] });
  const [tracks, setTracks] = useState({ selectedTrack: '', listOfTracksFromAPI: [] });
  const [trackDetail, setTrackDetail] = useState(null);

  useEffect(() => {

    //axios se conecta a la api con las credenciales indicadas en el complemeto Credential

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
      .then(tokenResponse => {
        setToken(tokenResponse.data.access_token);

        axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + tokenResponse.data.access_token }
        })
          .then(genreResponse => {
            setGenres({
              selectedGenre: genres.selectedGenre,
              listOfGenresFromAPI: genreResponse.data.categories.items
            })
          });

      });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

  const genreChanged = val => {
    setGenres({
      selectedGenre: val,
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    //axios trae las categorias de la api

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(playlistResponse => {
        setPlaylist({
          selectedPlaylist: playlist.selectedPlaylist,
          listOfPlaylistFromAPI: playlistResponse.data.playlists.items
        })
      });

  }

  const playlistChanged = val => {
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  //axios conecta a la api para traer las listas de canciones de las categorias
  const buttonClicked = e => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(tracksResponse => {
        setTracks({
          selectedTrack: tracks.selectedTrack,
          listOfTracksFromAPI: tracksResponse.data.items
        })
      });
  }

  const listboxClicked = val => {

    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackInfo = currentTracks.filter(t => t.track.id === val);

    setTrackDetail(trackInfo[0].track);



  }
  //para buscar el genero y buscar la playlist 
  return (
    <div className="container">
      <form onSubmit={buttonClicked}>
        <Dropdown label="Genero:" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
        <Dropdown label="Playlist:" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />
        <div className="col-sm-6 row form-group px-0">
          <button type='submit' className="btn btn-success px0 ">
            Search
          </button>
        </div>
        <div className="row">
          <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
          {trackDetail && <Detail {...trackDetail} />}
        </div>
      </form>
    </div>
  );
}

export default App;