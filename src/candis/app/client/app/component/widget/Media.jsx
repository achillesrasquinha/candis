import React     from 'react';
import PropTypes from 'prop-types'

class Media extends React.Component 
{
  render ( ) 
  {
    const props = this.props

    return (
      <div className="media">
        {
          props.icon ?
            <div className="media-left">
              <img className="media-object" src={props.icon} width="20" height="20"/>
            </div> : null
        }
        <div className="media-body">
          <div className="media-heading no-margin">
            {props.title}
          </div>
          {
            props.body ?
              <small>
                {props.body}
              </small> : null
          }
        </div>
      </div>
    )
  }
}

Media.propTypes    =
{
   icon: PropTypes.string,
  title: PropTypes.string.isRequired,
   body: PropTypes.string
}
Media.defaultProps = 
{
   icon: null,
   body: null
}

export default Media
