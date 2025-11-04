import React from 'react'
import type { UINodeDrawable } from '@brrd/types'
import DynComponent from './DynComponent'
import { JsRuntime } from '../core'

interface PreviewProps {
  drawable: UINodeDrawable | null
  rt: JsRuntime
}

const Preview: React.FC<PreviewProps> = ({ rt, drawable }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600">
        Preview
      </div>
      <div className="flex-1 p-5 overflow-auto flex justify-start items-start">
        {drawable ? (
          <DynComponent rt={rt} drawable={drawable} />
        ) : (
          <div className="text-center text-gray-500 text-base mt-10">
            <div className="mb-2.5 text-2xl">⚠️</div>
            <div>Code compilation failed or has errors</div>
            <div className="text-sm mt-2.5">
              Check the console for more details
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview