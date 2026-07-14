// src/store/toast.store.test.ts
import { useToastStore } from './toast.store'

beforeEach(() => {
  useToastStore.setState({ message: null })
})

describe('useToastStore', () => {
  it('should start with no message', () => {
    expect(useToastStore.getState().message).toBeNull()
  })

  it('should set the message on show()', () => {
    useToastStore.getState().show('Ocurrió un error')
    expect(useToastStore.getState().message).toBe('Ocurrió un error')
  })

  it('should clear the message on clear()', () => {
    useToastStore.getState().show('Ocurrió un error')
    useToastStore.getState().clear()
    expect(useToastStore.getState().message).toBeNull()
  })
})