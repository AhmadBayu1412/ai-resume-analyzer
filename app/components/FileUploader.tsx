import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '~/lib/utils'
import { UploadCloud, FileText, X } from 'lucide-react'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void
}

const FileUploader =  ({ onFileSelect }: FileUploaderProps)  => {
    const [file, setFile] = useState<File | null>(null)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null

        setFile(selectedFile)
        onFileSelect?.(selectedFile)
    }, [onFileSelect])

    const maxFileSize = 20 * 1024 * 1024

    const {getRootProps, getInputProps, isDragActive} = useDropzone({     
        onDrop,
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    return (
        <div className="w-full gradient-border p-[1px]">
            <div 
                {...getRootProps()} 
                className={`w-full bg-white rounded-2xl p-8 sm:p-5 transition-all duration-300 cursor-pointer border-2 border-dashed ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-transparent'}`}
            >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center justify-center text-center">
                    {file ? (
                        <div className="uploader-selected-file w-full bg-slate-50 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-4">
                                <FileText className="w-8 h-8 text-indigo-500" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[200px] sm:max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {formatSize(file.size)} • PDF
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => {
                                e.stopPropagation()
                                setFile(null)
                                onFileSelect?.(null)
                            }}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className={`w-16 h-16 flex items-center justify-center rounded-full transition-colors ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                <UploadCloud className={`w-8 h-8 ${isDragActive ? 'animate-bounce' : ''}`} />
                            </div>
                            <p className="text-lg text-slate-700 mb-1">
                                <span className="font-semibold text-indigo-600">
                                    Click to Upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-slate-500">PDF strictly (max 20 MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader