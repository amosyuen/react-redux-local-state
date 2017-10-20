import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import isEqual from 'lodash/isequal'

import { setComponentState } from './actions'

const defaultOptions = {
  reducerName: 'localState',
  propName: 'localState',
  mapStateToProps: (state) => { return {...state} },
  mapDispatchToProps: {},
  componentName: ''
}

function Shim(Component, options) {
  // merge options
  let mergedOptions = {}
  if (typeof options === 'string') { // only componentName is given
    mergedOptions = {...defaultOptions, componentName: options}
  } else if (typeof options === 'object' && options.componentName) {
    mergedOptions = {...defaultOptions, ...options}
  } else {
    throw 'Shim must be passed either a componentName string OR an options object with a componentName field'
  }

  let { reducerName, propName, mapStateToProps, mapDispatchToProps, componentName } = mergedOptions

  class Enhancer extends Component {
    constructor(props) {
      super(props)


      if (this.state) {
        this.props.setComponentState(componentName, this.state)
      }
    }

    // override the setState method to use redux
    setState(updater, callback) {
      // merge old state with state from updater
      let newState = {}
      if (typeof updater === 'function') {
        newState = {...this.state, ...updater(this.state, this.props)}
      } else if (typeof updater === 'object') {
        newState = {...this.state, ...updater}
      } else {
        throw 'setState must be passed a function or an object'
      }

      // fire redux action with new state
      this.props.setComponentState(componentName, newState)
    }

    // if redux version of local state changes, update the actual local state to match
    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props[propName], nextProps[propName])) {
        this.state = nextProps[propName]
      }

      // hook is only present on super if it is defined in the wrapped component
      if(super.componentWillReceiveProps) {
        super.componentWillReceiveProps(nextProps)
      }
    }

    render() {
      return super.render()
    }
  }


  return connect((state) => {
    // merge mapStateToProps result with local props and pass to component
    let propsFromState = mapStateToProps(state)
    propsFromState[propName] = {...state[reducerName][componentName]}
    return propsFromState
  }, (dispatch, ownProps) => {
    // merge mapDispatchToProps result with shim action creator
    if (typeof mapDispatchToProps === 'object') {
      return bindActionCreators({...mapDispatchToProps, setComponentState}, dispatch)
    } else if (typeof mapDispatchToProps === 'function') {
      return {...mapDispatchToProps(dispatch, ownProps), ...bindActionCreators({setComponentState}, dispatch)}
    }
  })(Enhancer)
}

export default Shim
