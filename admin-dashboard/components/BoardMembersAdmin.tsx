'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const boardMemberSchema = z.object({
  designation: z.string().min(1, 'Designation is required'),
  name: z.string().min(1, 'Name is required')
})

type BoardMemberFormData = z.infer<typeof boardMemberSchema>

interface BoardMember {
  id: number
  designation: string
  name: string
  created_at: string
}

export default function BoardMembersAdmin() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<BoardMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BoardMemberFormData>({
    resolver: zodResolver(boardMemberSchema)
  })

  useEffect(() => {
    fetchBoardMembers()
  }, [])

  const fetchBoardMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBoardMembers(data || [])
    } catch (error) {
      console.error('Error fetching board members:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BoardMemberFormData) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('board_members')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('board_members')
          .insert([data])
        if (error) throw error
      }
      
      await fetchBoardMembers()
      reset()
      setEditingItem(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving board member:', error)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this board member?')) return
    
    try {
      const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchBoardMembers()
    } catch (error) {
      console.error('Error deleting board member:', error)
    }
  }

  const openEditDialog = (item: BoardMember) => {
    setEditingItem(item)
    reset(item)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    reset({ designation: '', name: '' })
    setIsDialogOpen(true)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Board Members Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>Add New Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Board Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('designation')}
                  placeholder="Designation (e.g., President, Secretary)"
                />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
              </div>
              <div>
                <Input
                  {...register('name')}
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boardMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <CardTitle className="text-lg">{member.designation}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold mb-2">{member.name}</p>
              <p className="text-xs text-gray-400 mb-4">ID: {member.id} | Created: {new Date(member.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openEditDialog(member)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteItem(member.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}