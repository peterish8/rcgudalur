'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().url('Valid image URL is required')
})

type GalleryFormData = z.infer<typeof gallerySchema>

interface Gallery {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
}

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Gallery | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema)
  })

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGallery(data || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: GalleryFormData) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([data])
        if (error) throw error
      }
      
      await fetchGallery()
      reset()
      setEditingItem(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving gallery item:', error)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchGallery()
    } catch (error) {
      console.error('Error deleting gallery item:', error)
    }
  }

  const openEditDialog = (item: Gallery) => {
    setEditingItem(item)
    reset(item)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    reset({ title: '', description: '', image_url: '' })
    setIsDialogOpen(true)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Gallery Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('title')}
                  placeholder="Title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <Textarea
                  {...register('description')}
                  placeholder="Description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <Input
                  {...register('image_url')}
                  placeholder="Image URL"
                />
                {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
              </div>
              <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover mb-2" />
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-xs text-gray-400 mb-4">ID: {item.id} | Created: {new Date(item.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openEditDialog(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}