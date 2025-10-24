import type { Metadata } from 'next'
import React from 'react'
import AllFileUploads from './components/AllFileUploads'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'File Uploads' }

const FileUploader = () => {
  return (
    <>
      <PageTitle title='Uploads' subName='Forms' />
      <AllFileUploads />
      {/* <div className="row justify-content-center">
        <div className="col-md-6 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="card-title">Custom File Upload</h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="d-grid">
                <p className="text-muted">Upload your blog image here, Please click "Upload Image" Button.</p>
                <div className="preview-box d-block justify-content-center rounded  border-dashed border-theme-color overflow-hidden p-3" />
                <input type="file" id="input-file" name="input-file" accept="image/*" onchange="{handleChange()}" hidden />
                <label className="btn-upload btn btn-primary mt-3" htmlFor="input-file">Upload Image</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="card-title">Uppy File Upload</h4>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div id="drag-drop-area" />
            </div>
          </div>
        </div>
      </div> */}

    </>
  )
}

export default FileUploader
