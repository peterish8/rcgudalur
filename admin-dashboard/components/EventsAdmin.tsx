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

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  event_date: z.string().min(1, 'Event date is required'),
  image_url: z.string().url('Valid image URL is required')
})

type EventFormData = z.infer<typeof eventSchema>

interface Event {
  id: number
  title: string
  description: string
  event_date: string
  image_url: string
  created_at: string
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('events')
          .update(data)
          .eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('events')
          .insert([data])
        if (error) throw error
      }
      
      await fetchEvents()
      reset()
      setEditingItem(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const openEditDialog = (item: Event) => {
    setEditingItem(item)
    reset({
      ...item,
      event_date: item.event_date.split('T')[0] // Format for date input
    })
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    reset({ title: '', description: '', event_date: '', image_url: '' })
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>Add New Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('title')}
                  placeholder="Event Title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <Textarea
                  {...register('description')}
                  placeholder="Event Description"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <Input
                  {...register('event_date')}
                  type="date"
                  placeholder="Event Date"
                />
                {errors.event_date && <p className="text-red-500 text-sm">{errors.event_date.message}</p>}
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
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={event.image_url} alt={event.title} className="w-full h-32 object-cover mb-2" />
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <p className="text-sm font-medium text-blue-600 mb-2">{formatDate(event.event_date)}</p>
              <p className="text-xs text-gray-400 mb-4">ID: {event.id} | Created: {new Date(event.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openEditDialog(event)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteItem(event.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}