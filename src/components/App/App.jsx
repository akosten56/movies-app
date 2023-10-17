import React, { Component } from 'react'
import { Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import debounce from 'lodash.debounce'

import TMDBService from '../../services/tmdb-service'
import { Provider } from '../context'
import SearchInput from '../SearchInput'
import MoviesTab from '../MoviesTab'

import MyError from './MyError'

import './App.css'

class App extends Component {
  state = {
    sessionId: null,
    mode: 'search',
    searchInputValue: '',

    genresData: [],

    moviesData: [],
    totalPagesMovies: null,
    currentPageMovies: 1,

    ratedMoviesData: [],
    totalPagesRatedMovies: null,
    currentPageRatedMovies: 1,

    loading: true,
    error: null,
  }
  tmdbService = new TMDBService()

  componentDidMount() {
    this.tmdbService
      .createGuestSession()
      .then((data) => {
        this.setState({
          sessionId: data.guest_session_id,
        })
      })
      .catch((error) => {
        this.setState({
          error: error,
        })
      })

    this.tmdbService
      .getGenres()
      .then((data) => {
        this.setState({
          genresData: data.genres,
        })
      })
      .catch((error) => {
        this.setState({
          error: error,
        })
      })

    this.showPopularMovies()
  }

  startLoading = () => {
    this.setState(() => {
      return {
        loading: true,
      }
    })
  }

  showPopularMovies = (page) => {
    this.startLoading()
    this.tmdbService
      .getPopularMovies(page)
      .then((moviesData) => {
        this.setState({
          mode: 'search',
          moviesData: moviesData.results,
          totalPagesMovies: moviesData.total_pages < 500 ? moviesData.total_pages : 499,
          currentPageMovies: moviesData.page,
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error,
        })
      })
  }

  showSearchedMovies = debounce((value, page) => {
    if (value == '') return this.showPopularMovies(page)

    this.startLoading()
    this.tmdbService
      .getMoviesByKeyWord(value, page)
      .then((moviesData) => {
        console.log(moviesData)
        if (!moviesData.results.length) throw new Error('Nothing was found for this request 🔎')
        this.setState({
          mode: 'search',
          moviesData: moviesData.results,
          totalPagesMovies: moviesData.total_pages < 500 ? moviesData.total_pages : 499,
          currentPageMovies: moviesData.page,
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error,
        })
      })
  }, 300)

  showRatedMovies = (page) => {
    this.startLoading()
    this.tmdbService
      .getRatedMovies(this.state.sessionId, page)
      .then((ratedMoviesData) => {
        if (!ratedMoviesData.results.length) throw new Error('You can add something here!👀')
        this.setState({
          mode: 'rated',
          ratedMoviesData: ratedMoviesData.results,
          totalPagesRatedMovies: ratedMoviesData.total_pages < 500 ? ratedMoviesData.total_pages : 499,
          currentPageRatedMovies: ratedMoviesData.page,
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error,
        })
      })
  }

  handleSearchInputChange = (value) => {
    this.setState({
      searchInputValue: value,
    })
    return this.showSearchedMovies(value)
  }

  handleRate = (movieId, rating) => {
    this.tmdbService
      .addMovieToRated(this.state.sessionId, movieId, rating)
      .then((response) => {
        console.log(response.status)
      })
      .catch((error) => {
        console.error(error)
      })

    this.setState(({ moviesData }) => {
      const newMoviesData = [...moviesData]
      const movie = newMoviesData.find((el) => el.id === movieId)
      movie.rating = rating

      return {
        moviesData: newMoviesData,
      }
    })
  }

  handleSwitchPage = (page) => {
    const { mode, searchInputValue } = this.state
    if (mode === 'search') this.showSearchedMovies(searchInputValue, page)
    if (mode === 'rated') this.showRatedMovies(page)
  }

  render() {
    const { genresData, searchInputValue } = this.state
    const tabItems = [
      {
        label: 'Search',
        key: 1,
        children: (
          <>
            <SearchInput onInputChange={this.handleSearchInputChange} value={searchInputValue} />
            <Online>
              <MoviesTab
                type={'search'}
                {...this.state}
                switchPage={this.handleSwitchPage}
                handleRate={this.handleRate}
              />
            </Online>
            <Offline>
              <MyError message={'No internet connection 📡'} />
            </Offline>
          </>
        ),
      },
      {
        label: 'Rated',
        key: 2,
        children: (
          <>
            <Online>
              <MoviesTab
                type={'rated'}
                {...this.state}
                switchPage={this.handleSwitchPage}
                handleRate={this.handleRate}
              />
            </Online>
            <Offline>
              <MyError message={'No internet connection 📡'} />
            </Offline>
          </>
        ),
      },
    ]

    return (
      <div className="wrapper">
        <Provider value={genresData}>
          <Tabs
            defaultActiveKey="1"
            centered
            items={tabItems}
            onChange={(activeKey) => {
              if (activeKey == 1) return this.setState({ mode: 'search', error: null })
              if (activeKey == 2) return this.showRatedMovies()
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Provider>
      </div>
    )
  }
}

export default App
