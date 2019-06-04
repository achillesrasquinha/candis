import React           from 'react'
import PropTypes       from 'prop-types'
import Select          from 'react-select'
import classNames      from 'classnames'

import config          from '../../config'

class SelectViewer extends React.Component {
  constructor (props) {
    super (props)

    this.onChange = this.onChange.bind(this)

    this.state    = SelectViewer.defaultStates
  }

  onChange (value) {
    this.setState({
      select: value
    })

    this.props.onChange(value)
  }

  render ( ) {
    const props   = this.props
    const state   = this.state

    return (
      <div className={classNames("panel panel-default", props.classNames.root)}>
        <div className="panel-body">
          <Select
              options={props.options}
                 name="select"
                value={state.select}
             onChange={this.onChange}
            clearable={false}/>
        </div>
      </div>
    )
  }
}

SelectViewer.propTypes     = 
{
  classNames: PropTypes.object
}
SelectViewer.defaultProps  =
{
  classNames: { }
}

SelectViewer.defaultStates =
{
      select: { }
}

export default SelectViewer