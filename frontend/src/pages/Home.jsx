import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note"
import "../styles/Home.css"
import LoadingIndicator from "../components/Loadingindicator"

export function Home() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const getNotes = () => {
    api.get("/api/notes/")
      .then(
        (res) => res.data
      )
      .then((data) => { setNotes(data); console.log(data) })
      .catch((err) => { alert(err) })
  }

  const deleteNote = (id) => {
    api.delete(`/api/notes/delete/${id}/`).then((res) => {
      if (res.status === 204) {
        console.log("Note deleted!")
      } else {
        console.log("Failed to delet note.")
      }
      getNotes();
    }).catch((error) => { alert(error) });
  }

  const createNote = (e) => {
    setLoading(true)
    e.preventDefault();
    api.post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          console.log("note created!");
        } else {
          alert("Failed to make note")
        }
        setLoading(false)
        setContent("")
        setTitle("")
        getNotes();
      }).catch((err) => alert(err));
    
  }

  useEffect(() => {
    getNotes()
  }, [])


  return (
    <>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => 
          <Note note={note} onDelete={deleteNote} key={note.id} />
        )}
      </div>
      <h2>Create a Notes</h2>
      <form onSubmit={createNote} action="">
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          name="content"
          required
          id="content"
          value={content}
          onChange={(e) => {setContent(e.target.value)}}
        >
        </textarea>
        {loading && <LoadingIndicator />}
        <input type="submit"></input>
      </form>
    </>
  )
}

