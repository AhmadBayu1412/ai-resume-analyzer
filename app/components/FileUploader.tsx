import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils'
import { CloudUpload, FileText, X } from 'lucide-react'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null

        setFile(selectedFile)
        onFileSelect?.(selectedFile)
    }, [onFileSelect])

    const maxFileSize = 20 * 1024 * 1024

    const { getRootProps, getInputProps, isDragActive } = useDropzone({     
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        maxSize: maxFileSize,
    })

    return (
        <div className="w-full">
            <div 
                {...getRootProps()} 
                // Menghilangkan min-h dan mengurangi padding agar box tidak terlalu tinggi
                className={`w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden
                ${isDragActive 
                    ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                    : 'border-purple-500/40 bg-[#140F2D] hover:border-purple-400 hover:bg-purple-900/20'
                }`}
            >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center justify-center text-center z-10 w-full">
                    {file ? (
                        <div 
                            className="uploader-selected-file w-full bg-[#1C163C] border border-white/10 rounded-xl p-3 flex flex-row items-center justify-between transition-all hover:bg-white/5" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatSize(file.size)} • Ready
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="p-2 cursor-pointer hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors shrink-0" 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setFile(null)
                                    onFileSelect?.(null)
                                }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {/* Layout dikompres: teks "or" dihilangkan, gap dikurangi */}
                            <CloudUpload className={`w-8 h-8 text-purple-400 mb-2 ${isDragActive ? 'animate-bounce' : ''}`} strokeWidth={1.5} />
                            
                            <p className="text-sm font-medium text-white mb-3">
                                Drag & drop your file here
                            </p>
                            
                            <div className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-500/25">
                                Choose File
                            </div>

                            <p className="text-[11px] text-gray-500 font-medium mt-3">
                                Supports PDF, DOCX (Max 20MB)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader