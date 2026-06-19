type Callback = (payload: any) => void

class MockSocket {
  listeners: Record<string, Callback[]> = {}
  intervalId?: any

  on(event: string, cb: Callback) {
    this.listeners[event] = this.listeners[event] || []
    this.listeners[event].push(cb)
  }

  off(event: string, cb: Callback) {
    this.listeners[event] = (this.listeners[event] || []).filter((c) => c !== cb)
  }

  emit(event: string, payload: any) {
    ;(this.listeners[event] || []).forEach((cb) => cb(payload))
  }

  startSimulation() {
    if (this.intervalId) return
    // every 7s emit a comment from a random user
    this.intervalId = setInterval(() => {
      const users = [
        { id: 'alice', name: 'Alice', color: '#fb7185' },
        { id: 'bob', name: 'Bob', color: '#34d399' }
      ]
      const who = users[Math.floor(Math.random() * users.length)]
      const comment = {
        id: 'srv-' + Math.floor(Math.random() * 100000),
        author: who,
        text: Math.random() > 0.5 ? 'Nice update!' : 'I left a note on that item.',
        createdAt: Date.now()
      }
      this.emit('incoming:comment', comment)
    }, 7000)
  }

  stopSimulation() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = undefined
  }

  // simulate sending a comment and server confirming it
  sendComment(tempId: string, payload: { author: any; text: string; parentId?: string }) {
    setTimeout(() => {
      const confirmed: any = {
        id: 'srv-' + Math.floor(Math.random() * 100000),
        author: payload.author,
        text: payload.text,
        createdAt: Date.now()
      }
      if (payload.parentId) confirmed.parentId = payload.parentId
      this.emit('confirm:comment', { tempId, confirmed })
    }, 900)
  }
}

export const mockSocket = new MockSocket()
