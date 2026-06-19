import React from 'react'
import { useStore } from '../store/useStore'
import Card from './Card'
import { motion, AnimateSharedLayout } from 'framer-motion'

export default function Board(){
  const board = useStore((s) => s.board)
  const moveCard = useStore((s) => s.moveCard)

  function onDrop(e: React.DragEvent, toColId: string){
    e.preventDefault()
    try{
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { cardId, from } = data
      moveCard(cardId, from, toColId)
    }catch(err){
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <AnimateSharedLayout>
        {board.map((col: any) => (
          <div key={col.id} className="bg-transparent">
            <div className="mb-2 font-semibold">{col.title}</div>
            <div onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e, col.id)} className="min-h-[200px] p-2 rounded">
              {col.cards.map((card: any) => (
                <Card key={card.id} card={card} columnId={col.id} />
              ))}
            </div>
          </div>
        ))}
      </AnimateSharedLayout>
    </div>
  )
}
