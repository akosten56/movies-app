export default class TMDBService {
  constructor() {
    this.apiBase = 'https://api.themoviedb.org/3'

    this.apiKey = '8f419c4ba50c501095a0219b4d6c5787'
  }

  async getData(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`${response.status}`)
    const data = await response.json()
    return data
  }

  async postData(url, body = null) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }

    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`${response.status}`)
    return response
  }

  async createGuestSession() {
    return this.getData(`${this.apiBase}/authentication/guest_session/new?api_key=${this.apiKey}`)
  }

  async addMovieToRated(sessionId, movieId, rating) {
    return this.postData(
      `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
      { value: rating }
    )
  }

  async getGenres() {
    return this.getData(`${this.apiBase}/genre/movie/list?api_key=${this.apiKey}&language=en`)
  }

  async getRatedMovies(sessionId, page = 1) {
    return this.getData(
      `${this.apiBase}/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}`
    )
  }

  async getMoviesByKeyWord(keyWord, page = 1) {
    return this.getData(
      `${this.apiBase}/search/movie?api_key=${this.apiKey}&query=${keyWord}&include_adult=false&language=en-US&page=${page}`
    )
  }

  async getPopularMovies(page = 1) {
    return this.getData(`${this.apiBase}/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`)
  }
}
