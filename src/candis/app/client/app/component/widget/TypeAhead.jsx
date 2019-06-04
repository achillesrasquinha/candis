import React      from 'react'
import PropTypes  from 'prop-types'
import classNames from 'classnames'
import Fuse       from 'fuse.js'

import Media      from './Media'

class TypeAhead extends React.Component {
  constructor (props) {
    super (props)

    this.onChange = this.onChange.bind(this)
    this.state    = TypeAhead.defaultStates
  }

  onChange (event) {
    let query  = event.target.value
    let filter = this.fuse.search(query)

    if ( this.props.maximum ) {
        filter = filter.slice(0, this.props.maximum)
    }

    this.setState({
       query: query,
      filter: filter
    })
  }

  render ( ) {
    this.fuse  = new Fuse(this.props.data, { shouldSort: true, threshold: 0.6,
      location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1,
        keys: this.props.keys })

    return (
      <div className="form-group" style={{ position: 'relative' }}>
        <div className="input-group">
          <input className="form-control no-shadow no-outline"
            placeholder={this.props.placeholder} value={this.state.query}
            onChange={this.onChange}/>
          <div className="input-group-addon">
            <i className="fa fa-fw fa-search"></i>
          </div>
        </div>
        {
          this.state.query && this.state.filter.length ?
            <div style={{
                 position: 'absolute',
                   zIndex: 1010,
                maxHeight: '250px',
                boxShadow: '0 3px 8px 0 rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.08)', // Thanks, Google Search
                overflowY: 'scroll'
              }}>
              <ul className="list-group no-margin">
                {
                  this.state.filter.map((data, index) => {
                    let props    = { }

                    for (let key in this.props.map) {
                      props[key] = data[this.props.map[key]]
                    }

                    return (
                      <li key={index} className="list-group-item"
                        onMouseOver={() => { this.props.onMouseOver(data) }}
                        onMouseOut ={() => { this.props.onMouseOut(data) }}>
                        <a href="javascript:void(0);" onClick={() => {
                            this.setState(TypeAhead.defaultStates)

                            this.props.onSelect(data)
                          }}>
                          <Media {...props}/>
                        </a>
                      </li>
                    )
                  })
                }
              </ul>
            </div> : false
        }
      </div>
    )
  }
}

TypeAhead.propTypes     =
{
  placeholder: PropTypes.string,
         data: PropTypes.array.isRequired,
     onSelect: PropTypes.func.isRequired,
      maximum: PropTypes.number,
         keys: PropTypes.array,
  onMouseOver: PropTypes.func,
  onMouseOut : PropTypes.func
}

TypeAhead.defaultProps  =
{
  placeholder: "",
      maximum: null,
  onMouseOver: () => { },
  onMouseOut : () => { }
}

TypeAhead.defaultStates = { query: "", filter: [ ] }

export default TypeAhead
