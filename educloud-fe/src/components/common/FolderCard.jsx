import { motion } from 'framer-motion'
import { Folder } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { Card, CardContent } from '@/components/ui/card'

export default function FolderCard({ folder, onOpen, onContextMenu }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onDoubleClick={() => onOpen?.(folder)}
        onContextMenu={(e) => {
          e.preventDefault()
          onContextMenu?.(folder)
        }}
      >
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Folder className="h-14 w-14 text-amber-400 fill-amber-100" />
          <p className="mt-3 font-medium text-slate-900">{folder.name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {folder.itemCount} mục · {formatDate(folder.createdAt)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
