
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notenest-notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    localStorage.setItem('notenest-notes', JSON.stringify(notes))
  }, [notes])

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert('Please fill all fields!')
      return
    }

    if (editId !== null) {
      setNotes(notes.map(note =>
        note.id === editId
          ? { ...note, title: title.trim(), description: description.trim() }
          : note
      ))
      setEditId(null)
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        date: new Date().toLocaleDateString()
      }

      setNotes([...notes, newNote])
    }

    setTitle('')
    setDescription('')
  }

  function editNote(note) {
    setTitle(note.title)
    setDescription(note.description)
    setEditId(note.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteNote(id) {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id))

      if (editId === id) {
        setEditId(null)
        setTitle('')
        setDescription('')
      }
    }
  }

  function cancelEdit() {
    setEditId(null)
    setTitle('')
    setDescription('')
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <header className="header">
        <div className="logo">✎ NoteNest</div>
        <span className="tagline">Your Personal Notes Space</span>
      </header>

      <main className="container">
        <section className="welcome">
          <h1>Keep Your Ideas Safe.</h1>
          <p>Capture your thoughts, organize your day and never forget an idea.</p>
        </section>

        <section className="note-form">
          <h2>{editId !== null ? 'Edit Your Note' : 'Create a New Note'}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your thoughts here..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="4"
            />

            <div className="form-buttons">
              <button type="submit" className="primary-btn">
                {editId !== null ? 'Update Note' : '+ Add Note'}
              </button>

              {editId !== null && (
                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="notes-section">
          <div className="notes-heading">
            <div>
              <h2>My Notes</h2>
              <p>{notes.length} notes saved</p>
            </div>

            <input
              className="search-box"
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="notes-container">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <article className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>

                  <div className="note-footer">
                    <small>{note.date}</small>

                    <div className="note-actions">
                      <button
                        className="edit-btn"
                        onClick={() => editNote(note)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteNote(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>{search ? 'No notes found!' : 'No notes yet!'}</h3>
                <p>
                  {search
                    ? 'Try searching with another keyword.'
                    : 'Create your first note using the form above.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 NoteNest | Made with React ❤️</p>
      </footer>
    </div>
  )
}

export default App
