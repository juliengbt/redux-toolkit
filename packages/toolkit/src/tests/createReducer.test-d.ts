import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { createAction, createReducer } from '@reduxjs/toolkit'
import type { Reducer } from 'redux'

describe('type tests', () => {
  test('createReducer() infers type of returned reducer.', () => {
    const incrementHandler = (
      state: number,
      action: { type: 'increment'; payload: number }
    ) => state + 1
    const decrementHandler = (
      state: number,
      action: { type: 'decrement'; payload: number }
    ) => state - 1

    const reducer = createReducer(0 as number, (builder) => {
      builder
        .addCase('increment', incrementHandler)
        .addCase('decrement', decrementHandler)
    })

    const numberReducer: Reducer<number> = reducer

    // @ts-expect-error
    const stringReducer: Reducer<string> = reducer
  })

  test('createReducer() state type can be specified expliclity.', () => {
    const incrementHandler = (
      state: number,
      action: { type: 'increment'; payload: number }
    ) => state + action.payload

    const decrementHandler = (
      state: number,
      action: { type: 'decrement'; payload: number }
    ) => state - action.payload

    createReducer(0 as number, (builder) => {
      builder
        .addCase('increment', incrementHandler)
        .addCase('decrement', decrementHandler)
    })

    // @ts-expect-error
    createReducer<string>(0 as number, (builder) => {
      // @ts-expect-error
      builder
        .addCase('increment', incrementHandler)
        .addCase('decrement', decrementHandler)
    })
  })

  test('createReducer() ensures state type is mutable within a case reducer.', () => {
    const initialState: { readonly counter: number } = { counter: 0 }

    createReducer(initialState, (builder) => {
      builder.addCase('increment', (state) => {
        state.counter += 1
      })
    })
  })

  test('builder callback for actionMap', () => {
    const increment = createAction<number, 'increment'>('increment')

    const reducer = createReducer(0, (builder) =>
      expectTypeOf(builder).toEqualTypeOf<ActionReducerMapBuilder<number>>()
    )

    expectTypeOf(reducer(0, increment(5))).toBeNumber()

    expectTypeOf(reducer(0, increment(5))).not.toBeString()
  })
})
