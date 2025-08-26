# Admin Dashboard

This is a basic admin dashboard structure for managing your Rotary Club data.

## Features

- Gallery CRUD operations
- Events CRUD operations  
- Board Members CRUD operations
- Form validation
- Supabase integration

## Setup

1. Copy the components to your admin website
2. Install required dependencies:
   ```bash
   npm install @supabase/supabase-js react-hook-form @hookform/resolvers zod
   ```
3. Configure your Supabase connection
4. Add proper authentication

## Components

- `GalleryAdmin.tsx` - Manage gallery items
- `EventsAdmin.tsx` - Manage events
- `BoardMembersAdmin.tsx` - Manage board members
- `AdminLayout.tsx` - Basic layout wrapper

## Usage

Import and use the components in your admin application:

```tsx
import GalleryAdmin from './components/GalleryAdmin'
import EventsAdmin from './components/EventsAdmin'
import BoardMembersAdmin from './components/BoardMembersAdmin'
```