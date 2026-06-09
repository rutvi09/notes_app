import { useState, useEffect, useRef } from 'react'

const App = () => {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [task, setTask] = useState(() => {
    try {
      const savedNotes = localStorage.getItem('task')
      return savedNotes ? JSON.parse(savedNotes) : []
    } catch (error) {
      return []
    }
  })

  const resetForm = () => {
    setTitle('')
    setDetails('')
    setFile(null)
    setImage(null)
    setEditIndex(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (title.trim() === '' && details.trim() === '' && !file && !image) {
      alert('Please write something or attach a file/image before saving.')
      return
    }

    const copyTask = [...task]
    const note = { title, details, file, image }

    if (editIndex !== null) {
      copyTask[editIndex] = note
      setTask(copyTask)
    } else {
      copyTask.push(note)
      setTask(copyTask)
    }

    resetForm()
  }

  const clearFileSelection = () => {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const clearImageSelection = () => {
    setImage(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const deleteNote = (idx) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?')
    if (!confirmDelete) return

    const copyTask = [...task]
    copyTask.splice(idx, 1)
    setTask(copyTask)
  }

  const editNote = (idx) => {
    const note = task[idx]
    setTitle(note.title || '')
    setDetails(note.details || '')
    setFile(note.file || null)
    setImage(note.image || null)
    setEditIndex(idx)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  useEffect(() => {
    localStorage.setItem('task', JSON.stringify(task))
  }, [task])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onload = () => {
      setFile({
        name: selectedFile.name,
        dataUrl: reader.result,
      })
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleImage = (e) => {
    const selectedImage = e.target.files?.[0]
    if (!selectedImage) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage({
        name: selectedImage.name,
        dataUrl: reader.result,
      })
    }
    reader.readAsDataURL(selectedImage)
  }

  return (
    <div className='h-screen lg:flex text-white bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      <form
        onSubmit={submitHandler}
        className='flex flex-col gap-4 lg:w-1/2 p-8 m-4 rounded-2xl border border-slate-700/50 bg-slate-900/80 shadow-2xl'
      >
        <h1 className='text-4xl mb-2 font-bold'>
          {editIndex !== null ? 'Edit Note' : 'Add Notes'}
        </h1>

        <input
          type='text'
          placeholder='Enter Notes Heading'
          className='text-input px-5 w-full font-medium py-3 border-2 outline-none rounded-2xl'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /> 

        <textarea
          className='text-area px-5 w-full font-medium h-36 py-3 border-2 outline-none rounded-2xl resize-none'
          placeholder='Write details here'
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className='flex items-center gap-3 w-full'>
          <label className='flex-1 bg-slate-100 text-slate-950 py-3 font-medium rounded-2xl px-5 text-center cursor-pointer shadow-sm hover:bg-slate-50'>
            {file ? `Selected file: ${file.name}` : 'Choose file attachment'}
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <button
              type='button'
              onClick={clearFileSelection}
              className='w-12 h-12 rounded-full bg-red-500 text-white font-bold text-lg grid place-items-center hover:bg-red-600'
              aria-label='Remove selected file'
            >
              ×
            </button>
          )}
        </div>

        <div className='flex items-center gap-3 w-full'>
          <label className='flex-1 bg-slate-100 text-slate-950 py-3 object-fit font-medium rounded-2xl px-5 text-center cursor-pointer shadow-sm hover:bg-slate-50'>
            {image ? `Selected image: ${image.name}` : 'Choose image'}
            <input
              ref={imageInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImage}
            />
          </label>

          {image && (
            <button
              type='button'
              onClick={clearImageSelection}
              className='w-12 h-12 rounded-full bg-red-500 object-fit text-white font-bold text-lg grid place-items-center hover:bg-red-600'
              aria-label='Remove selected image'
            >
              ×
            </button>
          )}
        </div>

        {image && (
          <div className='relative h-full w-full rounded-2xl object-fit overflow-hidden border border-slate-300/20'>
            <img src={image.dataUrl} alt='Selected' className='w-full h-60 object-fit' />
            <button
              type='button'
              onClick={clearImageSelection}
              className='absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 text-white grid place-items-center shadow-lg hover:bg-red-600'
              aria-label='Remove preview image'
            >
              ×
            </button>
          </div>
        )}

        <button
          type='submit'
          className='bg-white text-slate-950 font-semibold w-full px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-transform duration-150'
        >
          {editIndex !== null ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <div className='lg:w-1/2 lg:border-l-2 h-[ 90%] border-slate-700/30 p-10 m-4 rounded-[2rem] bg-slate-900/80 shadow-2xl'>
        <h1 className='text-4xl font-bold mb-4'>Recent Notes</h1>
        <div className='flex flex-wrap items-start justify-start gap-5 mt-6 h-[90%] overflow-auto'>
          {task.map((elem, idx) => (
            <div
              key={idx}
              className='flex flex-col justify-between items-start w-full max-w-[18rem] rounded-[1.75rem] p-5 bg-white text-slate-950 border border-slate-200 shadow-xl hover:-translate-y-1 transition-transform duration-150'
            >
              <div className='w-full'>
                <h3 className='leading-tight text-xl font-bold mb-2 break-words'>{elem.title}</h3>
                <p className='mt-2 leading-relaxed text-sm font-medium text-slate-600 break-words whitespace-pre-line'>
                  {elem.details}
                </p>
              </div>

              {elem.image && (
                <img
                  src={elem.image.dataUrl}
                  alt={elem.image.name}
                  className='mt-4 w-full h-40 object-fit rounded-2xl'
                />
              )}

              {elem.file && (
                <div className='mt-4 text-sm text-slate-700'>
                  <p className='font-semibold'>File: {elem.file.name}</p>
                  <a
                    href={elem.file.dataUrl}
                    download={elem.file.name}
                    className='text-blue-700 hover:underline'
                  >
                    Download
                  </a>
                </div>
              )}

              <div className='w-full flex flex-col gap-2 mt-4'>
                <button
                  onClick={() => editNote(idx)}
                  className='w-full cursor-pointer active:scale-95 bg-indigo-600 py-2 text-sm rounded-xl font-bold text-white'
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(idx)}
                  className='w-full cursor-pointer active:scale-95 bg-red-500 py-2 text-sm rounded-xl font-bold text-white'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

