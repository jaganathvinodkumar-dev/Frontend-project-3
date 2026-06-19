import React from 'react'
import { motion } from 'framer-motion'
import { CardItem } from '../store/useStore'

type Props = {
  card: CardItem
  columnId: string
}

export default function Card({ card, columnId }: Props){
  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id, from: columnId }))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      draggable
      onDragStart={onDragStart as unknown as any}
      className="p-3 mb-3 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700 cursor-grab"
    >
      <div className="font-medium">{card.title}</div>
      {card.description ? <div className="text-sm text-gray-500 mt-1">{card.description}</div> : null}
    </motion.div>
  )
}
