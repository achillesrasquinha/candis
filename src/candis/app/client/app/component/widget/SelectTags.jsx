import React from "react"
import Select from "react-select"
// import "react-select/dist/react-select.css"

class SelectTags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      multiValue: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleChange(value) {
    // this will be used by Entrez Form to call setFieldValue and manually set
    // this.props.name to value.
    this.props.onChange(this.props.name, value)
  }

  handleBlur() {
    // this is going to call setFieldTouched and manually update touched.terms
    this.props.onBlur(this.props.name, true)
  }

  render() {
    const props = this.props
    return (
      <div>
        <div className="row">
          <Select.Creatable
            multi={props.multi}
            options={props.options}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={props.value}
            error={props.error}
          />
        </div>
        {props.touched  &&
          !!props.error && (
            <div style={{ color: "red", marginTop: ".5rem", marginBottom: ".5rem" }}>
              {props.error}
            </div>
          )}
      </div>
    )
  }
}

export default SelectTags
