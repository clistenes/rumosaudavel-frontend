import type { Metadata } from 'next'
import FoldersList from './components/FoldersList'
import AllFiles from './components/AllFiles'
import { Col, Row } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'File Manager' }

const FileManager = () => {
  return (
    <>
      <PageTitle title='Files' subName='Advanced UI' />
      <FoldersList />
      <Row className="justify-content-center">
        <Col xs={12}>
          <AllFiles />
        </Col>
      </Row>
    </>
  )
}

export default FileManager
