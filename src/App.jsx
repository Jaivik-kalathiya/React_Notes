import React from "react";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot,addDoc,doc,deleteDoc } from "firebase/firestore"
import { notesCollection,db} from "../firebase";

export default function App() {



  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0]?.id) || ""
  );

  React.useEffect(() => {
   const unsubscribe=onSnapshot(notesCollection,function(snapshot){
          // Sync up our local notes array with the snapshot data
          const notesArr = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setNotes(notesArr)

   })
   return unsubscribe; // helps in unmount while in memory leak
  }, [notes]);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
    };



    // storeData(newNote);
   const newNoteRef =  await addDoc(notesCollection,newNote);
    setCurrentNoteId(newNoteRef.id);
  }



  function updateNote(text) {
    //  Put the most recently-modified note at the top
    setNotes(oldNotes => {
      const newArray = []
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i]
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text })
        } else {
          newArray.push(oldNote)
        }
      }
      return newArray
    })

  }


 async function deleteNote(noteId) {
    const docRef = doc(db,"notes",noteId);
    await deleteDoc(docRef)
   
  }


  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
