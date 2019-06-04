import store from '../Store'

// here we are testing the store we have created in Store.jsx unlike in index.test.js where we are using the createStore directly.
// can be written better ?
test('smoke test: should setup store using createStore', () => {
    expect(Object.keys(store).sort()).toEqual(
        ['dispatch', 'getState', 'replaceReducer', 'subscribe'].sort()
    )
})
