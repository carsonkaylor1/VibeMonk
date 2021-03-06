export let deviceID;
export let spotify_uri_num
let player;

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
export let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '28e3d5fbf78849fa82982068bf1f9589';
//const redirectUri = 'http://vibemonk.surge.sh/';
const redirectUri = 'https://carsonkaylor1.github.io/VibeMonk/';
const scopes = [
  'streaming',
  'user-read-private',
  'user-modify-playback-state',
  "user-read-email",
  'playlist-modify-public'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Set up the Web Playback SDK

window.onSpotifyPlayerAPIReady = () => {
    player = new Spotify.Player({
    name: 'Web Playback SDK Template',
    getOAuthToken: cb => { cb(_token); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => {
    console.log(state)
    $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    $('#current-track-name').text(state.track_window.current_track.name);
  });

  // Ready
  player.on('ready', data => {
    deviceID = data.device_id;
    // Play a track using our new device ID
    //play(data.device_id);
  });
  // Connect to the player!
  player.connect();
}

// Play a specified track on the Web Playback SDK's device ID
export function playTrack(device_id, spotify_uri) {
  spotify_uri_num = spotify_uri
  let data_info = '{\"uris\": [\"' + spotify_uri + '\"]}';
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: data_info,
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     console.log(data)
   }
  });
}

export function pauseTrack(){
  player.pause().then(() => {
    console.log('Paused!');
  });
}

export function resumeTrack(){
  player.resume();
}
