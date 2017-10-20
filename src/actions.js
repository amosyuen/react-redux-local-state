export const RRLS_SET_COMPONENT_STATE = 'RRLS_SET_COMPONENT_STATE'


export function setComponentState(name, state) {
  return {
    type: RRLS_SET_COMPONENT_STATE,
    name: name,
    payload: state
  }
}
