# react-redux-local-state
A simple react higher order component which automagically uses redux instead of local React state.
Use it as a shim to expose an existing component's internal state to redux, or to make new redux ready components without
having to write redux boilerplate!

## Usage

#### Step 1 - Connect reducer to redux

```javascript
import { createStore, combineReducers } from 'redux'
import { reducer as localStateReducer } from 'react-redux-local-state'

const rootReducer = combineReducers({
  localState: localStateReducer
  // other reducers here
})

const store = createStore(rootReducer)
```

Note: by default the reducer's state slice is named is localState, if you need to use a different name
you can do so, but the name will have to be passed in the options of each enhancer call.

#### Step 2 - Decorate your component

```javascript
import { Shim } from 'react-redux-local-state'

const ShimmedComponent = Shim(YourComponent, 'componentName')

let options = {
  componentName: 'otherComponentName',
  propName: 'someOtherPropName'
}

const ShimmedComponentWithOptions = Shim(YourComponent, options)

export ShimmedComponent

export ShimmedComponentWithOptions
```

That's it! All of the decorated component's local state will now be handled by redux.
Any calls to this.setState will fire the 'RRLS_SET_COMPONENT_STATE' action.

#### Customizing connect's arguments

All decorated components connect to redux's store to listen to updates to state.
If you want to pass custom mapStateToProps or mapDispatchToProps to connect,
pass them as fields in the shim's option argument. The shim will automatically merge the results
of your supplied arguments with its own and pass them to the component.

#### Props

By default the component will get the setComponentState function and the rrls_localState object as props. If you need to change the name of these props to avoid collisions, you can set the actionName or propName fields in the option object.


## Caveats

This decorator functions by completely overwriting the decorated component's setState method. super.setState is never called. This has a few implications:
1. If the component is wrapped in another HOC which overwrites the setState method, or if the component itself overwrites the method, this shim won't work properly.
2. Any performance benefits from react's internal state batching is lost.




## TODO

* error handling
* tests
