import { useEffect, useState } from "react"
import './App.css'
import axios from 'axios'
import Movie from "./components/Movie"
import Youtube from 'react-youtube'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7sQjn4lxQQGkb6itrqWrP3RAFX1j5-KQ",
  authDomain: "cinemetrailer.firebaseapp.com",
  projectId: "cinemetrailer",
  storageBucket: "cinemetrailer.appspot.com",
  messagingSenderId: "155823769451",
  appId: "1:155823769451:web:40d87e20ddb1c1d994ee2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

 export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
  .then((result) => {
    console.log(result)
    const name = result.user.displayName;
    const email = result.user.email;
    const profilePic = result.user.photoURL;

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("profilePic", profilePic);
    
  })
  .catch((error) => {
    console.log(error);
  });
};


function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/"
  const SEARCH_API = MOVIE_API + "search/movie"
  const SEARCH_POP_API = MOVIE_API + "movie/popular"
  const SEARCH_TOP_API = MOVIE_API + "movie/top_rated"
  
  const DISCOVER_API = MOVIE_API + "discover/movie"
  const API_KEY = "d080004efb38fede1753960b869fc0cc"
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

  const [playing, setPlaying] = useState(false)
  const [trailer, setTrailer] = useState(null)
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [movie, setMovie] = useState({ title: "Loading Movies" })




  useEffect(() => {
    fetchMovies()
    fetchPopularMovies()
    fetchTopMovies()
  }, [])

  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault()
    }

    const { data } = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
      params: {
        api_key: API_KEY,
        query: searchKey
      }
    })

    console.log(data.results[0])
    setMovies(data.results)
    setMovie(data.results[0])

    if (data.results.length) {
      await fetchMovie(data.results[0].id)
    }
  }
  const fetchPopularMovies = async (event) => {
    if (event) {
      event.preventDefault()
    }

    const { data } = await axios.get(MOVIE_API + SEARCH_POP_API +'?api_key='+ API_KEY, {
    })

    console.log(data.results[0])
    setMovies(data.results)
    setMovie(data.results[0])

    if (data.results.length) {
      await fetchMovie(data.results[0].id)
    }
  }

  const fetchTopMovies = async (event) => {
    if (event) {
      event.preventDefault()
    }

    const { data } = await axios.get(MOVIE_API + SEARCH_TOP_API +'?api_key='+ API_KEY, {
    })

    console.log(data.results[0])
    setMovies(data.results)
    setMovie(data.results[0])

    if (data.results.length) {
      await fetchMovie(data.results[0].id)
    }
  }

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos"
      }
    })

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
      setTrailer(trailer ? trailer : data.videos.results[0])
    }

    setMovie(data)
  }


  const selectMovie = (movie) => {
    fetchMovie(movie.id)
    setPlaying(false)
    setMovie(movie)
    window.scrollTo(0, 0)
  }

  const renderMovies = () => (
    movies.map(movie => (
      <Movie
        selectMovie={selectMovie}
        key={movie.id}
        movie={movie}
      />
    ))
  )

  return (
    <div className="App">
      <header className="center-max-size header">
        <nav class="navbar is-fixed-top is-black" role="navigation" aria-label="main navigation">
          <div class="navbar-brand px-3">
            <a class="navbar-item" href="/">
              <h1 class="has-text-weight-bold is-size-4 is-size-5-touch" id="nav-logo">
              <img src="https://www.clipartmax.com/png/small/452-4526075_video-recorder-clipart-animated-movie-camara-de-video.png"></img>
              </h1>
            </a>

            <a role="button" class="navbar-burger m-0" aria-label="menu" aria-expanded="false"
              data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>


          <form class="form navbar-item navbar-search field has-addons mb-0 search-hide search-form" onSubmit={fetchMovies}>
            <div class="control">
              <span id="menu-search-filter" class="select is-rounded">
                <select class="search-filter-dropdown">
                  <option value="movie">Movies</option>

                </select>
              </span>
            </div>
            <div class="control is-expanded">
              <input class="input" type="text" placeholder="Search for a Movie" id="search-input" onInput={(event) => setSearchKey(event.target.value)} />
            </div>
            <div class="control">
              <button class="button is-info is-rounded" type="submit" id="search">
                <span class="icon">
                  <i class="fa-solid fa-magnifying-glass fa-lg"></i>
                </span>
              </button>
            </div>
            <div class="App">
              <button class="login-with-google-btn" onClick={signInWithGoogle}>Sign In With Google</button>
            </div>
          </form>
         
         
          <div className="google">
          <div> 
            <img  src={localStorage.getItem("profilePic")} />
          </div>
          
              <h8>{localStorage.getItem("name")}</h8>
              <br></br>
              <h8>{localStorage.getItem("email")}</h8>
              </div>
        </nav>
      </header>
     





      {movies.length ?
        <main>
          
          {movie ?
            <div className="poster" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})` }}>
              {playing ?
                <>
                
                  <Youtube
                    videoId={trailer.key}
                    className={"youtube amru"}
                    containerClassName={"youtube-container amru"}
                    opts={
                      {
                        //This sets the height and the width of the video player
                        width: '1280px',
                        height: '720px',
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          cc_load_policy: 0,
                          fs: 0,
                          iv_load_policy: 0,
                          modestbranding: 0,
                          rel: 0,
                          showinfo: 0,
                        },
                      }
                    }
                  />
                
                  <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                  </button>
                </> :
                <div className="center-max-size">
                  <div className="poster-content">
                    {trailer ?
                      <button class={"button play-video center-max-size"} onClick={() => setPlaying(true)}
                        type="button">PlayTrailer</button>
                      : 'Sorry, no trailer available'}
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              }
            </div>
            : null}

          <div className={"center-max-size container"}>
            {renderMovies()}
          </div>
        </main>
        : 'Sorry, no movies found'}
    </div>
  );
}

export default App;