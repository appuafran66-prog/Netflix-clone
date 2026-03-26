# My List - Database Setup Guide

## Step 1: Create the `my_list` Table in Supabase

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** or **Tables** section
3. Create a new table with the following SQL:

```sql
CREATE TABLE my_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  movie_rating FLOAT,
  movie_overview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint to prevent duplicate movies for same user
ALTER TABLE my_list ADD CONSTRAINT unique_user_movie UNIQUE(user_id, movie_id);

-- Create index for faster queries
CREATE INDEX idx_my_list_user_id ON my_list(user_id);
```

## Step 2: Enable Row Level Security (RLS)

For security, enable RLS so users can only see their own data:

1. Go to your table in Supabase
2. Click **RLS** tab (under "Help")
3. Enable RLS
4. Add this policy:

```sql
-- Users can only view their own data
CREATE POLICY "Users can view their own list"
ON my_list FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own list"
ON my_list FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete their own list"
ON my_list FOR DELETE
USING (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own list"
ON my_list FOR UPDATE
USING (auth.uid() = user_id);
```

## Step 3: Use the Hook in Your Component

```jsx
import MyListComponent from './components/MyListComponent/MyListComponent'

// In your App.jsx or any page:
<Route path="/mylist" element={<MyListComponent />} />
```

## Step 4: Use the Hook in TitleCards Component (Optional)

To add a "+" button to add movies directly from movie cards:

```jsx
import { useMyList } from '../hooks/useMyList'

const TitleCards = ({ title, category }) => {
  const { addToList, isInList, error, success } = useMyList()

  const handleAddToList = async (card) => {
    await addToList({
      movie_id: card.id.toString(),
      title: card.original_title,
      poster_path: card.poster_path,
      movie_rating: card.vote_average,
      movie_overview: card.overview
    })
  }

  return (
    <Link className="card" to={`/player/${card.id}`}>
      <img src={...} />
      <p>{card.original_title}</p>
      <button 
        onClick={(e) => {
          e.preventDefault()
          handleAddToList(card)
        }}
        className={isInList(card.id.toString()) ? 'in-list' : ''}
      >
        {isInList(card.id.toString()) ? '✓ In List' : '+ Add'}
      </button>
    </Link>
  )
}
```

## Table Schema Details

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| movie_id | TEXT | TMDB movie ID |
| title | TEXT | Movie title |
| poster_path | TEXT | Path to poster image (from TMDB) |
| movie_rating | FLOAT | Movie rating (0-10) |
| movie_overview | TEXT | Movie description |
| created_at | TIMESTAMP | When added to list |
| updated_at | TIMESTAMP | Last updated |

## API Function Reference

### useMyList Hook Functions

```js
const { 
  myList,              // Array of movies in list
  user,                // Current logged-in user
  loading,             // Loading state
  error,               // Error message
  success,             // Success message
  addToList,           // Add movie function
  removeFromList,      // Remove movie function
  fetchMyList,         // Manually fetch list
  isInList,            // Check if movie is in list
  clearMessages        // Clear error/success messages
} = useMyList()

// Add movie to list
await addToList({
  movie_id: '123',
  title: 'Movie Title',
  poster_path: '/path/to/poster.jpg',
  movie_rating: 8.5,
  movie_overview: 'Movie description...'
})

// Remove movie from list
await removeFromList('123')

// Check if movie is in list
isInList('123') // returns true/false
```

## Troubleshooting

### Error: "No user logged in"
- Make sure user is logged in via Auth component
- Check if session exists: `supabase.auth.getSession()`

### Error: "relation 'my_list' does not exist"
- Create the table using the SQL above
- Check table name is exactly `my_list`

### Duplicate movie error
- The unique constraint prevents adding same movie twice
- Remove first, then add again

### RLS errors
- Enable RLS and add the policies from Step 2
- Check user_id in database matches auth.uid()

