'use client'
import useToggle from '@/hooks/useToggle'
import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Row } from 'react-bootstrap'

export type PlacementOption = {
  name: string
  placement?: 'start' | 'end' | 'top' | 'bottom'
  variant: string
}

export const placementOptions: PlacementOption[] = [
  {
    name: 'Left',
    placement: 'start',
    variant: 'primary',
  },
  {
    name: 'Right',
    placement: 'end',
    variant: 'secondary',
  },
  {
    name: 'Top',
    placement: 'top',
    variant: 'success',
  },
  {
    name: 'Bottom',
    placement: 'bottom',
    variant: 'info',
  },
]

const LiveDemo = () => {
  const { isTrue, toggle } = useToggle()
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Live demo</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <a className="btn btn-outline-primary" onClick={toggle} data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
          Link with href
        </a>&nbsp;
        <button className="btn btn-outline-primary" onClick={toggle} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          Button with data-bs-target
        </button>
        <Offcanvas show={isTrue} onHide={toggle} className="offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
          <OffcanvasHeader>
            <OffcanvasTitle as={'h5'} className="mt-0" id="offcanvasExampleLabel">Offcanvas</OffcanvasTitle>
            <button type="button" onClick={toggle} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
          </OffcanvasHeader>
          <OffcanvasBody>
            <div>
              Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
            </div>
            <Dropdown className="mt-3">
              <DropdownToggle as={'button'} className="btn btn-secondary" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                Dropdown button
              </DropdownToggle>
              <DropdownMenu aria-labelledby="dropdownMenuButton">
                <li><DropdownItem>Action</DropdownItem></li>
                <li><DropdownItem>Another action</DropdownItem></li>
                <li><DropdownItem>Something else here</DropdownItem></li>
              </DropdownMenu>
            </Dropdown>
          </OffcanvasBody>
        </Offcanvas>
      </CardBody>
    </Card>
  )
}

const Placement = () => {

  const OffcanvasPlacement = ({ name, ...props }: PlacementOption) => {
    const { isTrue, toggle } = useToggle()

    return (
      <>
        <button onClick={toggle} className="btn btn-outline-primary mt-2 me-1 mt-md-0">
          {' '}
          Toggle {name} offcanvas
        </button>
        <Offcanvas show={isTrue} onHide={toggle} {...props}>
          <OffcanvasHeader closeButton>
            <OffcanvasTitle as={'h5'} className="mt-0">
              Offcanvas {name}
            </OffcanvasTitle>
          </OffcanvasHeader>

          <OffcanvasBody>
            <div>Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.</div>
            <h5 className="mt-3">List</h5>
            <ul className="ps-3">
              <li>Nemo enim ipsam voluptatem quia aspernatur</li>
              <li>Neque porro quisquam est, qui dolorem</li>
              <li>Quis autem vel eum iure qui in ea</li>
            </ul>
          </OffcanvasBody>
        </Offcanvas>
      </>
    )
  }


  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Placement </CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div>
          {placementOptions.map((props, idx) => (
            <OffcanvasPlacement {...props} key={idx} />
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

const Backdrop = () => {
  const { isTrue, toggle } = useToggle()
  const { isTrue: backdropIsTrue, toggle: backdropToggle } = useToggle()
  const { isTrue: scrollingIsTrue, toggle: scrollingToggle } = useToggle()
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Backdrop</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <button className="btn btn-outline-primary" onClick={toggle} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Enable body scrolling</button>&nbsp;
        <button className="btn btn-outline-primary" onClick={backdropToggle} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBackdrop" aria-controls="offcanvasWithBackdrop">Enable backdrop (default)</button>&nbsp;
        <button className="btn btn-outline-primary" type="button" onClick={scrollingToggle} data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Enable both scrolling &amp; backdrop</button>&nbsp;
        <Offcanvas show={isTrue} onHide={toggle} placement='start' data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
          <OffcanvasHeader>
            <OffcanvasTitle as={'h5'} className="mt-0" id="offcanvasScrollingLabel">Colored with scrolling</OffcanvasTitle>
            <button type="button" onClick={toggle} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>Try scrolling the rest of the page to see this option in action.</p>
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas show={backdropIsTrue} onHide={backdropToggle} placement='start' tabIndex={-1} id="offcanvasWithBackdrop" aria-labelledby="offcanvasWithBackdropLabel">
          <OffcanvasHeader>
            <OffcanvasTitle as={'h5'} className="mt-0" id="offcanvasWithBackdropLabel">Offcanvas with backdrop</OffcanvasTitle>
            <button type="button" onClick={backdropToggle} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>.....</p>
          </OffcanvasBody>
        </Offcanvas>
        <Offcanvas show={scrollingIsTrue} onHide={scrollingToggle} placement='start' data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
          <OffcanvasHeader>
            <OffcanvasTitle as={'h5'} className="mt-0" id="offcanvasWithBothOptionsLabel">Backdroped with scrolling</OffcanvasTitle>
            <button type="button" onClick={scrollingToggle} className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
          </OffcanvasHeader>
          <OffcanvasBody>
            <p>Try scrolling the rest of the page to see this option in action.</p>
          </OffcanvasBody>
        </Offcanvas>
      </CardBody>
    </Card>
  )
}


const AllOffcanvas = () => {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={6} lg={6}>
          <LiveDemo />
        </Col>
        <Col md={6} lg={6}>
          <Placement />
        </Col>
      </Row>
      <Row>
        <Col md={6} lg={6}>
          <Backdrop />
        </Col>
      </Row>
    </>
  )
}

export default AllOffcanvas 