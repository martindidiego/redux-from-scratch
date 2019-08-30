/**
 * Creates a Redux store which will hold all our application
 * state.
 */
export const createStore = reducer => {
  /**
   * This is where our global application state
   * will live.
   *
   * Notice the use of `let` here -- we won't ever
   * be mutating the state directly but instead
   * replacing it with the next state each time.
   */
  let state;

  /**
   * This will hold a list of referneces to listener
   * functions that we'll fire when the state changes.
   *
   * Any time a part of our UI subscribes to our store,
   * we'll add that to this list.
   */
  const listeners = [];

  /**
   * Returns the current state of the Store.
   */
  const getState = () => state;

  /**
   * Dispatches an action to trigger a state change
   * and then invokes all listeners.
   */
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());

    /**
     * We return the Action so that we can chain Actions
     * in other parts of our application.
     */
    return action;
  };

  /**
   * Add a subscription to our list of listeners.
   */
  const subscribe = listener => {
    listeners.push(listener);

    /**
     * Return an unsubscribe function to allow consumers
     * to remove the given listener.
     */
    return function unsubscribe() {
      const idx = listeners.indexOf(listener);
      listeners.splice(idx, 1);
    };
  };

  return { getState, dispatch, subscribe };
};

/**
 * Combines multiple reducers that deal with individual
 * slices of state into one big app reducer.
 *
 * This composed reducer is typically what is fed into
 * `createStore`.
 */
export const combineReducers = reducers => {
  const reducerKeys = Object.keys(reducers);
  function combinedReducer(state = {}, action) {
    const nextState = {};
    reducerKeys.forEach(key => {
      nextState[key] = reducers[key](state[key], action);
    });
    return nextState;
  }

  return combinedReducer;
};

/**
 * Wraps `dispatch` functions with the provided middleware
 * functions. Notice the curried functions.
 */
export const applyMiddleware = (...middlewares) => {
  return createStore => reducer => {
    const store = createStore(reducer);
    return {
      ...store,
      dispatch: function dispatch(action) {
        /**
         * Replace `store.dispatch` with `next` if you need to
         * support composed middlewares.
         */
        return middlewares(store)(store.dispatch)(action);
      }
    };
  };
};

/**
 * Wraps Action Creators in `dispatch` calls for the consumer so
 * that they don't have to call `store.dispatch(ActionCreator.something())`
 * each time.
 */
export const bindActionCreators = (actionCreators, dispatch) => {
  const boundedActionCreators = {};
  const actionKeys = Object.keys(actionCreators);
  actionKeys.forEach(key => {
    const actionCreator = actionCreators[key];
    boundedActionCreators[key] = function boundedActionCreator() {
      return dispatch(actionCreator.apply(this, arguments));
    };
  });
  return boundedActionCreators;
};
