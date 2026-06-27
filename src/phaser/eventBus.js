export const EVENTS = {
  SPIN_REQUEST: 'SPIN_REQUEST',
  SPIN_STARTED: 'SPIN_STARTED',
  SPIN_RESULT: 'SPIN_RESULT',
  BIG_WIN: 'BIG_WIN',
}

class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe()
      callback(payload)
    })
    return unsubscribe
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((callback) => {
      callback(payload)
    })
  }

  clear() {
    this.listeners.clear()
  }
}

export const eventBus = new EventBus()
