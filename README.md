# react-redux-local-state
A simple react higher order component which automagically uses redux instead of local React state.
Use it as a shim to expose an existing component's internal state to redux, or to make new redux ready components without
having to write redux boilerplate!

## Usage

### Step 1 - Connect reducer to redux

```javascript
import { createStore, combineReducers } from 'redux'
import { reducer as localStateReducer } from 'react-redux-local-state'

const rootReducer = combineReducers({
  localState: localStateReducer
  // other reducers here
})

const store = createStore(rootReducer)
```

Note: by default the reducer's state slice's name is localState, if you need to use a different name for the state slice,
you can do so, but the name will have to be passed to each call of the component decorator.

### Step 2 - Decorate your component

```javascript
import { Shim } from 'react-redux-local-state'

const ShimmedComponent = Shim(YourComponent, 'componentName')

export ShimmedComponent
```

That's it! All of the decorated component's local state will now be handled by redux!
Any calls to this.setState will fire the 'RRLS_SET_COMPONENT_STATE' action.



## Caveats

This decorator functions by completely overwriting the decorated component's setState method. super.setState is never called. This has a few implications:
1. If the component is wrapped in another HOC which overwrites the setState method, or if the component itself overwrites the method, this shim won't work properly.
2. Any performance benefits from react's internal state batching is lost.

All components decorated by this library are by necessity connected to redux using redux-form's connect function in order to listen to their own state changes.


## TODO

error handling
tests
