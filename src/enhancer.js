import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import isEqual from 'lodash/isequal'

import { setComponentState } from './actions'

import defaultOptions from './defaults'

function Enhancer(componentName, options) {
  // merge options
  var mergedOptions = {}
  if (options && typeof options === 'object') {
    mergedOptions = {...defaultOptions, ...options}
  } else {
    throw 'Options argument must be a simple object'
  }

  var { reducerName, propName, actionName } = mergedOptions

  // merge mapStateToProps result with local state prop and pass to component
  var mapStateToProps = (state, ownProps) => {
    let propsFromState = mergedOptions.mapStateToProps(state, ownProps)
    propsFromState[propName] = {...state[reducerName][componentName]}
    return propsFromState
  }

  // generate mapDispatchToProps
  var mapDispatchToProps = () => {}
  if (typeof mergedOptions.mapDispatchToProps === 'object') {
    mapDispatchToProps = {...mergedOptions.mapDispatchToProps,}
    mapDispatchToProps[actionName] = setComponentState
  } else if (typeof mergedOptions === 'function') {
    mapDispatchToProps = (dispatch, ownProps) => {
      let actionCreators = {...mergedOptions.mapDispatchToProps(dispatch, ownProps)}
      actionCreators[actionName] = bindActionCreators({setComponentState}, dispatch)
      return actionCreators
    }
  } else {
    throw 'mapDispatchToProps must be an object of action creators or a function!'
  }

  return function Decorator(Component) {

    class Enhanced extends Component {
      constructor(props) {
        super(props)

        if (this.state) {
          this.props.setComponentState(componentName, this.state)
        }
      }

      // override the setState method to use redux
      setState(updater, callback = null) {
        // register the callback
        if (callback && typeof callback === 'function') {
          this._rrls_cb = callback
        }

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
          if (this._rrls_cb) {
            _rrls_cb() // execute callback
            _rrls_cb = null // unregister callback
          }
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


    return connect(mapStateToProps, mapDispatchToProps)(Enhanced)
  }
}

export default Enhancer
