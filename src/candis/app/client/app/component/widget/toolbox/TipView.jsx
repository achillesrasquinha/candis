import React     from 'react'
import PropTypes from 'prop-types'

class TipView extends React.Component {
  render ( ) {
    return (
      <div>
        <div className="font-bold">
          {this.props.title}
        </div>
        <div className="text-justify">
          {this.props.content}
        </div>
      </div>
    )
  }
}

TipView.propTypes = { title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired }

export default TipView
