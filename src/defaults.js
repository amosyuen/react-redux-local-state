export default defaultOptions = {
  // String - The name of the state slice passed to combineReducers
  reducerName: 'localState',

  // String - The name of the local state prop passed to the component
  propName: 'rrls_localState',

  // String - The name of the function to change the state, passed as a prop to the component
  actionName: 'setComponentState',

  // Function - mapStateToProps function to pass to the internal connect call
  // See react-redux docs for more information
  mapStateToProps: (state, ownProps) => { return {} },

  // Object or Function - mapDispatchToProps to pass to internal connect call
  // See react-redux docs for more information
  mapDispatchToProps: {}
}
