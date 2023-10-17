import React from 'react'

import MovieCard from '../MovieCard'

import './MovieCardList.css'

const MovieCardList = ({ films, sessionId, genresData, handleRate }) => {
  const elements = films.map(
    ({ id, title, overview, poster_path, release_date, genre_ids, vote_average, rating = 0 }) => {
      const genres = genre_ids.map((genreId) => {
        return (
          <li key={genreId} className="movie-card__genre">
            {genresData.find((el) => el.id == genreId).name}
          </li>
        )
      })
      return (
        <li key={id} className="movie-card-list__item">
          <MovieCard
            sessionId={sessionId}
            movieId={id}
            title={title}
            overview={overview}
            posterPath={poster_path}
            releaseDate={release_date}
            genres={genres}
            handleRate={handleRate}
            averageRating={vote_average}
            rating={rating}
          />
        </li>
      )
    }
  )

  return <ul className="movie-card-list">{elements}</ul>
}

export default MovieCardList
