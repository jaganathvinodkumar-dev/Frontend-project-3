import create from 'zustand'

export type PresenceUser = { id: string; name: string; color?: string; online: boolean }
export type CommentItem = { id: string; author: PresenceUser; text: string; createdAt: number; resolved?: boolean; pending?: boolean; parentId?: string; replies?: CommentItem[]; mentions?: string[] }

export type CardItem = { id: string; title: string; description?: string }
export type Column = { id: string; title: string; cards: CardItem[] }

type State = {
  sidebarOpen: boolean
  toggleSidebar: () => void

  // theme
  isDark: boolean
  toggleTheme: () => void

  // presence
  presence: PresenceUser[]
  setPresence: (p: PresenceUser[]) => void

  // comments (threaded)
  comments: CommentItem[]
  addOptimisticComment: (c: CommentItem) => void
  confirmComment: (tempId: string, confirmed: CommentItem) => void
  resolveComment: (id: string) => void
  addOptimisticReply: (parentId: string, c: CommentItem) => void
  confirmReply: (parentId: string, tempId: string, confirmed: CommentItem) => void
  // board (drag/drop)
  board: Column[]
  moveCard: (cardId: string, fromColId: string, toColId: string, toIndex?: number) => void
  addCardToColumn: (colId: string, card: CardItem) => void
}

const now = () => Date.now()

function replaceRecursive(items: CommentItem[], predicate: (c: CommentItem) => boolean, replacer: (c: CommentItem)=> CommentItem): CommentItem[]{
  return items.map((c) => {
    if (predicate(c)) return replacer(c)
    if (c.replies && c.replies.length) return { ...c, replies: replaceRecursive(c.replies, predicate, replacer) }
    return c
  })
}

function insertReply(items: CommentItem[], parentId: string, reply: CommentItem): CommentItem[]{
  return items.map((c) => {
    if (c.id === parentId){
      return { ...c, replies: [reply, ...(c.replies || [])] }
    }
    if (c.replies && c.replies.length) return { ...c, replies: insertReply(c.replies, parentId, reply) }
    return c
  })
}

export const useStore = create<State>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  isDark: false,
  toggleTheme: () => {
    const next = !get().isDark
    set({ isDark: next })
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },

  presence: [
    { id: 'me', name: 'You', color: '#60a5fa', online: true },
    { id: 'alice', name: 'Alice', color: '#fb7185', online: true },
    { id: 'bob', name: 'Bob', color: '#34d399', online: false }
  ],
  setPresence: (p) => set({ presence: p }),

  comments: [],
  addOptimisticComment: (c) => set((s) => ({ comments: [ { ...c, replies: c.replies || [] }, ...s.comments ] })),
  // replace any comment matching tempId anywhere in tree
  confirmComment: (tempId, confirmed) => set((s) => ({ comments: replaceRecursive(s.comments, (c) => c.id === tempId, () => ({ ...confirmed, pending: false, replies: confirmed.replies || [] })) })),
  resolveComment: (id) => set((s) => ({ comments: replaceRecursive(s.comments, (c) => c.id === id, (c) => ({ ...c, resolved: true })) })),
  addOptimisticReply: (parentId, c) => set((s) => ({ comments: insertReply(s.comments, parentId, { ...c, replies: c.replies || [] }) })),
  confirmReply: (parentId, tempId, confirmed) => set((s) => ({ comments: replaceRecursive(s.comments, (c) => c.id === tempId, () => ({ ...confirmed, pending: false, replies: confirmed.replies || [] })) })),
  // simple board state for drag/drop demo
  board: [
    { id: 'col-1', title: 'To Do', cards: [ { id: 'card-1', title: 'Design header' }, { id: 'card-2', title: 'Setup auth' } ] },
    { id: 'col-2', title: 'In Progress', cards: [ { id: 'card-3', title: 'Live updates' } ] },
    { id: 'col-3', title: 'Done', cards: [ { id: 'card-4', title: 'Project scaffold' } ] }
  ] as Column[],
  moveCard: (cardId: string, fromColId: string, toColId: string, toIndex?: number) => set((s: any) => {
    const board = (s.board as Column[]).map((c: Column) => ({ ...c, cards: [...c.cards] }))
    const fromCol = board.find((c) => c.id === fromColId)
    const toCol = board.find((c) => c.id === toColId)
    if (!fromCol || !toCol) return { board }
    const cardIdx = fromCol.cards.findIndex((c) => c.id === cardId)
    if (cardIdx === -1) return { board }
    const [card] = fromCol.cards.splice(cardIdx, 1)
    const insertAt = typeof toIndex === 'number' ? toIndex : toCol.cards.length
    toCol.cards.splice(insertAt, 0, card)
    return { board }
  }),
  addCardToColumn: (colId: string, card: CardItem) => set((s: any) => ({ board: (s.board as Column[]).map((c: Column) => c.id === colId ? { ...c, cards: [card, ...c.cards] } : c) }))
}))
