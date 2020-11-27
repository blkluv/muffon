import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { List, Tab, Segment } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'
import axios from 'axios'
import ErrorData from 'partials/ErrorData'
import Artist from './artists/Artist'

export default class Artists extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount () {
    this._isMounted = true
    this.request = axios.CancelToken.source()

    this.getData()
  }

  componentWillUnmount () {
    this._isMounted = false
    this.request.cancel()
  }

  getData () {
    const switchLoader = loading => {
      this._isMounted && this.setState({ ...{ loading } })
    }

    switchLoader(true)

    const { query } = this.props

    const url = '/lastfm/search/artists'
    const limit = 10
    const params = { ...{ query, limit } }
    const cancelToken = this.request.token
    const extra = { ...{ params, cancelToken } }

    const handleSuccess = resp => {
      this.setState({ artists: resp.data.search.artists })
    }

    const handleError = error => {
      !axios.isCancel(error) && this.setState({ error: error, artists: null })
    }

    axios
      .get(url, extra)
      .then(handleSuccess)
      .catch(handleError)
      .then(() => switchLoader(false))
  }

  artistsData () {
    const { artists } = this.state
    const { hideSearch } = this.props

    const artistData = artist => {
      const key = uuid()
      const artistProps = { artist, hideSearch, key }

      return <Artist {...artistProps} />
    }
    const artistsListData = artists && artists.map(artistData)
    const artistsList = (
      <List
        selection
        size="medium"
        verticalAlign="middle"
        className="searchResultsTabContentList"
        content={artistsListData}
      />
    )

    return (
      <Router>
        <div className="searchResultsTabContent">{artistsList}</div>
      </Router>
    )
  }

  render () {
    const { artists, error } = this.state
    const { active } = this.props

    const loading = active && this.state.loading

    const artistsData = artists && this.artistsData()

    const errorData = error && <ErrorData {...{ error }} />

    const content = artistsData || errorData

    return (
      <Tab.Pane className="searchResultsTab" {...{ active }}>
        <Segment
          className="searchResultsTabContentWrap"
          {...{ loading, content }}
        />
      </Tab.Pane>
    )
  }
}
