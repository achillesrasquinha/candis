import React     from 'react'
import PropTypes from 'prop-types'
import shortid   from 'shortid'

class XEditable extends React.Component {
  componentDidMount ( ) {
    const props = this.props
    
    $(`#${props.ID}`).editable({
      success: (response, value) => { props.onChange(value) }
    })
  }

  render ( ) {
    const props = this.props

    return (
      <a href='javascript:void(0);' id={props.ID}
               data-type="text" 
              data-title={props.title}
        data-showbuttons="false"
          data-emptytext={props.empty}>
        {this.props.value}
      </a>
    )
  }
}

XEditable.propTypes    =
{
       ID: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    empty: PropTypes.string
}
XEditable.defaultProps = 
{
       ID: shortid.generate(),
    title: "",
    value: "",
    empty: "",
}

export default XEditable
