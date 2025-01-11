import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })



export const TextEditor = ({ value, setValue, id = 'text-area', ...props }) => {
  return (
    <ReactQuill
      id={id}
      theme="snow"
      value={value}
      onChange={setValue}
      {...props}
    />
  )
}
