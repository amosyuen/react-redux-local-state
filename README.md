# react-redux-local-state
A react higher order component (HOC) which automagically uses redux instead of local React state. Use it to expose an existing component's local state to redux or to write new redux ready components without the boilerplate

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

Note: by default the reducer's state slice is named is localState, if you need to use a different name you can do so, but the name will have to be passed in the options of each enhancer call.

#### Step 2 - Enhance your component

```javascript
import { Enhancer } from 'react-redux-local-state'
import YourComponent from './YourComponent'

const EnhancedComponent = Enhancer('componentName')(YourComponent)

let options = {
  componentName: 'otherComponentName',
  propName: 'someOtherPropName'
}

const EnhancedComponentWithOptions = Enhancer('componentName', options)(YourComponent)

export EnhancedComponent

export EnhancedComponentWithOptions
```

That's it! All of the enhanced component's local state will now be handled by redux. Any calls to this.setState will fire the 'RRLS_SET_COMPONENT_STATE' action. The component's this.state will be automatically be updated to match the redux store.

#### Customizing connect's arguments

All enhanced components connect to redux's store to listen to updates to state. If you want to pass custom mapStateToProps or mapDispatchToProps to connect, pass them as fields in the enhancer's option argument. The enhancer will automatically merge the results of your supplied arguments with its own and pass them to the component.

Custom arguments for connect's mergeProps and options are not currently supported.

#### Props

By default the component will get the setComponentState function and the rrls_localState object as props. If you need to change the name of these props to avoid collisions, you can set the actionName or propName fields in the option object.


## Caveats
This HOC functions by completely overwriting the enhanced component's setState method. super.setState is never called. This has a few implications:
1. If the component is wrapped in another HOC which overwrites the setState method, or if the component itself overwrites the method, this HOC won't work properly.
2. Normally, this.setState is batched by react. Components enhanced with this HOC instead receive their own local state as a prop. As a result, the internal batching isn't used. This shouldn't affect most component, but could potentially cause issues if the enhanced component somehow relies on the specifics of this internal batching.
3. While this batching isn't used, the overwritten this.setState still won't guarantee that an immediate call to this.state will be updated. A callback should still be used if you need to immediately access an updated this.state



## TODO

* better error handling
* tests
