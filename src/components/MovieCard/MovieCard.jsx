import React from 'react'
import { Card, Rate } from 'antd'
import { format } from 'date-fns'

import './MovieCard.css'

const MovieCard = ({
  movieId,
  title,
  overview,
  posterPath,
  releaseDate,
  genres,
  rating,
  averageRating,
  handleRate,
}) => {
  function cutOverview(overview, maxLength) {
    let cutOverview = overview.substring(0, maxLength)
    const lastSpaceIndex = cutOverview.lastIndexOf(' ')
    cutOverview = cutOverview.substring(0, lastSpaceIndex) + '...'

    return cutOverview
  }

  let date, poster
  releaseDate ? (date = format(new Date(releaseDate), 'MMMM d, y')) : (date = 'unknown date')

  posterPath
    ? (poster = `https://image.tmdb.org/t/p/w200${posterPath}`)
    : (poster = 'https://hacc.org/wp-content/uploads/2019/03/image-not-available-200x300.jpg')

  let circleColor
  if (averageRating >= 0 && averageRating < 3) circleColor = '#E90000'
  if (averageRating >= 3 && averageRating < 5) circleColor = '#E97E00'
  if (averageRating >= 5 && averageRating < 7) circleColor = '#E9D100'
  if (averageRating >= 7) circleColor = '#66E900'

  return (
    <Card hoverable bodyStyle={{ padding: 0 }} bordered={true}>
      <div className="movie-card">
        <div className="movie-card__image">
          <img src={poster} alt="" />
        </div>
        <div className="movie-card__info">
          <h2 className="movie-card__title">{title}</h2>
          <span className="movie-card__date">{date}</span>
          <ul className="movie-card__genres">{genres}</ul>
        </div>
        <div className="movie-card__description">
          <div className="movie-card__overview">{cutOverview(overview, 100)}</div>
          <div className="movie-card__average-rating" style={{ border: `2px solid ${circleColor}` }}>
            {averageRating.toFixed(1)}
          </div>
          <Rate allowHalf defaultValue={rating} count={10} onChange={(rating) => handleRate(movieId, rating)} />
        </div>
      </div>
    </Card>
  )
}

export default MovieCard
