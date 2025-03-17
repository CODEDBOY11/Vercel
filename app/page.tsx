"use client";
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [movieId, setMovieId] = useState(550); // Default movie ID (e.g., 550 for "Fight Club")
  const [movieData, setMovieData] = useState(null);

  // Fetch movie data from TMDB API
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=04553a35f2a43bffba8c0dedd36ac92b`
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [movieId]); // Re-fetch when movieId changes

  // Handle movie ID input change
  const handleMovieIdChange = (e) => {
    setMovieId(e.target.value);
  };

  // Toggle navbar and overlay
  const toggleNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');
    navbar.classList.toggle('open');
    overlay.classList.toggle('open');
  };

  // Close navbar and overlay
  const closeNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');
    navbar.classList.remove('open');
    overlay.classList.remove('open');
  };

  // Download file function
  const downloadFile = () => {
    const fileURL = 'https://drive.google.com/file/d/1-0jZhPa4cW4Kg7-QRbdl-Vrshq5Vyz0E/view?usp=drivesdk';
    const a = document.createElement('a');
    a.href = fileURL;
    a.download = 'extraction.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Show subscribe message and download file
  const showSubscribeMessageAndDownloadFile = () => {
    const message = document.getElementById('subscribe-message');
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
    }, 7000);
    downloadFile();
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Head>
        <title>A Day and a Half movie download</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <i
          className="fa fa-bars text-white text-3xl cursor-pointer"
          onClick={toggleNavbar}
        ></i>
        <h1 className="text-white text-2xl font-bold">NETDOT.COM</h1>
        <a href="https://coddedweb.free.nf/music.php">
          <i id="search" className="fa fa-search text-white text-2xl"></i>
        </a>
      </div>

      {/* Overlay */}
      <div className="overlay" onClick={closeNavbar}></div>

      {/* Navbar Content */}
      <div className="navbar">
        <header className="bg-gray-900 p-4">
          <div className="flex justify-between items-center">
            <i
              className="fa fa-arrow-left text-white text-3xl cursor-pointer"
              onClick={toggleNavbar}
            ></i>
            <h1 className="text-white text-2xl font-bold">NETDOT.COM</h1>
            <a href="https://coddedweb.free.nf/music.php">
              <i id="search" className="fa fa-search text-white text-2xl"></i>
            </a>
          </div>
        </header>

        <div className="p-4">
          <input
            type="text"
            placeholder="Enter Movie ID"
            value={movieId}
            onChange={handleMovieIdChange}
            className="w-full p-2 mb-4 text-black rounded-lg"
          />
          <button
            className="w-full flex items-center p-4 mb-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300"
            onClick={() => (window.location.href = 'index.html')}
          >
            <i className="fa fa-home mr-4 text-xl"></i>
            <span className="text-lg">Home</span>
          </button>

          {/* Add other navigation buttons here */}
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-white text-4xl font-bold my-4 text-center">Movies</h1>
      <div className="scroll-container overflow-x-auto whitespace-nowrap p-4">
        <div className="scroll-content inline-block">
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Action
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Bollywood
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Cartoon
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Horror
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Adventure
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Sci-fi
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            K-dramas
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Nollywood
          </a>
          <a className="inline-block px-4 py-2 mx-2 text-white bg-blue-800 rounded-lg" href="">
            Yoruba
          </a>
        </div>
      </div>

      {/* Dynamically Display Movie Information */}
      {movieData && (
        <>
          <h1 className="text-white text-5xl font-courier my-4 text-center">{movieData.title}</h1>
          <img
            className="w-3/5 mx-auto my-4 rounded-lg"
            src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
            alt={movieData.title}
          />
          <p className="text-white font-courier text-xl my-4 text-center">{movieData.overview}</p>
        </>
      )}

      <div className="video-container relative w-full h-0 pb-[56.25%] my-4">
        <iframe className="absolute top-0 left-0 w-full h-full" allowFullScreen></iframe>
      </div>

      <div
        id="subscribe-message"
        className="hidden fixed bottom-48 left-8 right-8 bg-red-600 text-white p-4 rounded-full text-center"
      >
        Thank you for Choosing Tuneflix <br /> Please Download More
      </div>
      <button
        id="subscribe-button"
        onClick={showSubscribeMessageAndDownloadFile}
        className="block mx-auto my-4 px-8 py-4 bg-gray-300 text-blue-900 font-courier text-3xl font-bold rounded-lg"
      >
        Download
      </button>
      <button id="subtitleButton" className="w-3/5 h-16 bg-red-800 text-red-900 font-courier text-xl font-bold my-4 mx-auto block">
        SUBTITLE
      </button>

      <button
        className="block mx-auto my-4 px-8 py-4 bg-red-600 text-white font-fantasy text-xl rounded-lg"
        onClick={() => (window.location.href = 'https://divisionary-aid.000webhostapp.com/comment.php')}
      >
        Comment
      </button>

      <h1 className="text-white text-3xl my-4 text-center">MORE ACTION MOVIES</h1>
      <div className="container flex overflow-x-auto p-4">
        {/* Add your movie links and images here */}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-8">
        <p id="netdotText" className="text-red-600 text-4xl font-bold font-fantasy text-center">
          TUNEFLIX.COM
        </p>
        <div className="footer-left inline-block w-1/2">
          <h3 className="border-b border-white pb-2">Contact Us</h3>
          <p>Email: tuneflix@gmail.com</p>
          <p>Phone: +234 912 140 8611</p>
          <p>Phone: +234 901 063 1071</p>
        </div>
        <div className="footer-center inline-block w-1/2">
          <h3 className="border-b border-white pb-2">Quick Links</h3>
          <a href="index.html">Home</a>
          <a href="movies.html">Movies</a>
          <a href="Music.html">Music</a>
          <a href="News.html">News</a>
        </div>
        <div className="footer-right inline-block w-1/2">
          <h3 className="border-b border-white pb-2">Follow Us</h3>
          <a href="https://www.facebook.com/profile.php?id=61552159980507" target="_blank">
            Facebook
          </a>
          <a href=" " target="_blank">
            Twitter
          </a>
          <a href="https://whatsapp.com/channel/0029VaBPCnh7j6g7BgEsI01B" target="_blank">
            Whatsapp
          </a>
        </div>
        <div className="footer-bottom text-center mt-8">
          <p>&copy; <span id="currentYear">{new Date().getFullYear()}</span> tuneflix. All rights reserved.</p>
          <p>
            <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
