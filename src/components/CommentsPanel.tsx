import React, { useEffect, useState } from 'react'
import { useStore, CommentItem } from '../store/useStore'
import { mockSocket } from '../lib/mockSocket'

function parseMentions(text: string){
  const mentions = [] as string[]
  const re = /@([a-zA-Z0-9_-]+)/g
  let m
  while ((m = re.exec(text)) !== null){
    mentions.push(m[1])
  }
  return mentions
}

function renderWithMentions(text: string){
  const parts = text.split(/(@[a-zA-Z0-9_-]+)/g)
  return parts.map((p, i) => p.startsWith('@') ? <span key={i} className="text-primary font-medium">{p}</span> : <span key={i}>{p}</span>)
}

export default function CommentsPanel(){
  const comments = useStore((s) => s.comments)
  const addOptimistic = useStore((s) => s.addOptimisticComment)
  const addOptimisticReply = useStore((s) => s.addOptimisticReply)
  const confirm = useStore((s) => s.confirmComment)
  const confirmReply = useStore((s) => s.confirmReply)
  const me = useStore((s) => s.presence.find((p) => p.id === 'me')!)

  useEffect(() => {
    const onIncoming = (c: any) => {
      if (c.parentId) addOptimisticReply(c.parentId, { ...c, pending: false })
      else addOptimistic({ ...c, pending: false })
    }
    const onConfirm = ({ tempId, confirmed }: any) => {
      if (confirmed.parentId) confirmReply(confirmed.parentId, tempId, { ...confirmed, pending: false })
      else confirm(tempId, { ...confirmed, pending: false })
    }
    mockSocket.on('incoming:comment', onIncoming)
    mockSocket.on('confirm:comment', onConfirm)
    mockSocket.startSimulation()
    return () => {
      mockSocket.off('incoming:comment', onIncoming)
      mockSocket.off('confirm:comment', onConfirm)
      mockSocket.stopSimulation()
    }
  }, [addOptimistic, addOptimisticReply, confirm, confirmReply])

  const [text, setText] = useState('')
  const [filter, setFilter] = useState<'all'|'unresolved'|'mine'>('all')
  const [replyOpen, setReplyOpen] = useState<Record<string,boolean>>({})
  const [replyText, setReplyText] = useState<Record<string,string>>({})

  function send(){
    if (!text.trim()) return
    const tempId = 'tmp-' + Date.now()
    const mentions = parseMentions(text).map((m) => m.toLowerCase())
    const item: CommentItem = { id: tempId, author: me, text, createdAt: Date.now(), pending: true, mentions }
    addOptimistic(item)
    mockSocket.sendComment(tempId, { author: me, text })
    setText('')
  }

  function sendReply(parentId: string){
    const t = replyText[parentId] || ''
    if (!t.trim()) return
    const tempId = 'tmp-' + Date.now()
    const mentions = parseMentions(t).map((m)=>m.toLowerCase())
    const item: CommentItem = { id: tempId, author: me, text: t, createdAt: Date.now(), pending: true, parentId, mentions }
    addOptimisticReply(parentId, item)
    mockSocket.sendComment(tempId, { author: me, text: t, parentId })
    setReplyText((s) => ({ ...s, [parentId]: '' }))
    setReplyOpen((s) => ({ ...s, [parentId]: false }))
  }

  function matchesFilter(c: CommentItem){
    if (filter === 'all') return true
    if (filter === 'mine') return c.author.id === me.id || (c.replies || []).some(r=>r.author.id === me.id)
    if (filter === 'unresolved') return !c.resolved || (c.replies || []).some(r=>!r.resolved)
    return true
  }

  const visible = comments.filter(matchesFilter)

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">Comments</div>
        <div className="flex gap-2 text-sm">
          <button onClick={()=>setFilter('all')} className={`px-2 py-1 rounded ${filter==='all'?'bg-gray-200 dark:bg-gray-800':''}`}>All</button>
          <button onClick={()=>setFilter('unresolved')} className={`px-2 py-1 rounded ${filter==='unresolved'?'bg-gray-200 dark:bg-gray-800':''}`}>Unresolved</button>
          <button onClick={()=>setFilter('mine')} className={`px-2 py-1 rounded ${filter==='mine'?'bg-gray-200 dark:bg-gray-800':''}`}>Mine</button>
        </div>
      </div>

      <div className="space-y-3 max-h-[45vh] overflow-auto">
        {visible.map((c) => (
          <div key={c.id} className="p-2 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div style={{background:c.author.color}} className="h-6 w-6 rounded-full" />
                <div className="font-medium">{c.author.name}</div>
              </div>
              <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleTimeString()}</div>
            </div>
            <div className="mt-2 text-sm">{renderWithMentions(c.text)} {c.pending ? <span className="text-xs text-gray-400">(sending...)</span> : null}</div>

            {/* replies */}
            <div className="mt-3 space-y-2 pl-6">
              {(c.replies || []).map((r) => (
                <div key={r.id} className="p-2 rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div style={{background:r.author.color}} className="h-5 w-5 rounded-full" />
                      <div className="font-medium">{r.author.name}</div>
                    </div>
                    <div className="text-xxs text-gray-500">{new Date(r.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <div className="mt-1 text-sm">{renderWithMentions(r.text)} {r.pending ? <span className="text-xs text-gray-400">(sending...)</span> : null}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button onClick={()=>setReplyOpen((s)=>({...s, [c.id]: !s[c.id]}))} className="text-sm text-primary">Reply</button>
              {c.resolved ? <span className="text-xs text-gray-400">Resolved</span> : null}
            </div>

            {replyOpen[c.id] ? (
              <div className="mt-2">
                <textarea value={replyText[c.id] || ''} onChange={(e)=>setReplyText((s)=>({ ...s, [c.id]: e.target.value }))} className="w-full p-2 rounded border" rows={2} />
                <div className="flex justify-end mt-2">
                  <button onClick={()=>sendReply(c.id)} className="px-3 py-1 rounded bg-primary text-white text-sm">Send Reply</button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <textarea id="comment-input" aria-label="Write a comment" placeholder="Write a comment, use @username to mention" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 rounded border" rows={3} />
        <div className="flex justify-end mt-2">
          <button aria-label="Send comment" onClick={send} className="px-4 py-2 rounded bg-primary text-white">Send</button>
        </div>
      </div>
    </div>
  )
}
