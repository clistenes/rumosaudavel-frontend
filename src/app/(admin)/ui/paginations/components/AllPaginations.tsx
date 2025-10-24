'use client'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import Link from 'next/link'
import { Col, Pagination, Row } from 'react-bootstrap'

const DefaultExample = () => {
  return (
    <ComponentContainerCard title="Default Example">
      <nav aria-label="Page navigation example">
        <Pagination>
          <Pagination.Item>
            Previous
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item>
            2
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
      <nav aria-label="Page navigation example">
        <Pagination>
          <Pagination.First />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Last />
        </Pagination>
      </nav>
    </ComponentContainerCard>
  )
}

const DisabledAndActivePagination = () => {
  return (
    <ComponentContainerCard title="Disabled And Active States">
      <nav aria-label="...">
        <Pagination>
          <Pagination.Item className=" disabled">
            Previous
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item className=" active">
            2 <span className="sr-only">(current)</span>
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
      <nav aria-label="...">
        <Pagination>
          <Pagination.Item className=" disabled">
            <span className="page-link">Previous</span>
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item className=" active">
            <span className="page-link">
              2<span className="sr-only">(current)</span>
            </span>
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
    </ComponentContainerCard>
  )
}

const SizingExample = () => {
  return (
    <ComponentContainerCard title="Sizing Example">
      <nav aria-label="...">
        <Pagination size="lg">
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
        </Pagination>
      </nav>
      <nav aria-label="...">
        <Pagination size="sm">
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
        </Pagination>
      </nav>
    </ComponentContainerCard>
  )
}

const AlignmentExample = () => {
  return (
    <ComponentContainerCard title="Alignment Example">
      <nav aria-label="Page navigation example">
        <Pagination>
          <Pagination.Item>
            Previous
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item>
            2
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
      <nav aria-label="Page navigation example">
        <Pagination className="justify-content-center">
          <Pagination.Item className=" disabled">
            <Link className="page-link" href="" tabIndex={-1}>
              Previous
            </Link>
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item>
            2
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
      <nav aria-label="Page navigation example">
        <Pagination className="justify-content-end">
          <Pagination.Item className=" disabled">
            <Link className="page-link" href="" tabIndex={-1}>
              Previous
            </Link>
          </Pagination.Item>
          <Pagination.Item>
            1
          </Pagination.Item>
          <Pagination.Item>
            2
          </Pagination.Item>
          <Pagination.Item>
            3
          </Pagination.Item>
          <Pagination.Item>
            Next
          </Pagination.Item>
        </Pagination>
      </nav>
    </ComponentContainerCard>
  )
}
const AllPaginations = () => {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={6}>
          <DefaultExample />
        </Col>
        <Col md={6}>
          <DisabledAndActivePagination />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <SizingExample />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <AlignmentExample />
        </Col>
      </Row>
    </>
  )
}

export default AllPaginations
