import React from 'react'
import { Spin, Pagination, Flex } from 'antd'

import MovieCardList from '../MovieCardList'
import { Consumer } from '../context'
import MyError from '../App/MyError'

const MoviesTab = ({
  type,
  error,
  loading,
  sessionId,
  moviesData,
  currentPageMovies,
  totalPagesMovies,
  ratedMoviesData,
  currentPageRatedMovies,
  totalPagesRatedMovies,
  switchPage,
  handleRate,
}) => {
  if (error) {
    return (
      <Flex justify="center" align="center" style={{ height: '80vh' }}>
        <MyError message={error.message} />
      </Flex>
    )
  } else if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: '68vh' }}>
        <Spin size="large" />
      </Flex>
    )
  } else if (type === 'search') {
    return (
      <>
        <Consumer>
          {(genresData) => (
            <MovieCardList films={moviesData} sessionId={sessionId} genresData={genresData} handleRate={handleRate} />
          )}
        </Consumer>
        {moviesData.length < 20 ? null : (
          <Pagination
            defaultCurrent={currentPageMovies}
            total={totalPagesMovies * 10}
            showLessItems={true}
            onChange={switchPage}
            style={{ margin: '24px 0', textAlign: 'center' }}
          />
        )}
      </>
    )
  } else if (type === 'rated') {
    return (
      <>
        <Consumer>
          {(genresData) => (
            <MovieCardList
              films={ratedMoviesData}
              sessionId={sessionId}
              genresData={genresData}
              handleRate={handleRate}
            />
          )}
        </Consumer>
        {ratedMoviesData.length < 20 ? null : (
          <Pagination
            defaultCurrent={currentPageRatedMovies}
            total={totalPagesRatedMovies * 10}
            showLessItems={true}
            onChange={switchPage}
            style={{ margin: '24px 0', textAlign: 'center' }}
          />
        )}
      </>
    )
  }
}

export default MoviesTab
