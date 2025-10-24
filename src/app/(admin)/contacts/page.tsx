import IconifyIcon from '@/components/wrappers/IconifyIcon'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownMenu, DropdownToggle, FormCheck, Row } from 'react-bootstrap'
import ContactListTable from './components/ContactListTable'
import { getAllUsers } from '@/helpers/data'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Contacts' }

const Contacts = async () => {
  const filters = ['All', 'New', 'Active', 'InActive']
  const contacts = await getAllUsers()

  return (
    <>
    <PageTitle title='Contacts' subName='Apps' />
    <Row>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <CardTitle as={'h4'}>Contacts</CardTitle>
              </Col>
              <Col xs="auto">
                <form className="row g-2">
                  <Col xs="auto">
                    <Dropdown>
                      <DropdownToggle
                        variant="link"
                        className="btn bg-primary-subtle text-primary d-flex align-items-center arrow-none"
                        role="button">
                        <IconifyIcon icon="iconoir:filter-alt" className="me-1" /> Filter
                      </DropdownToggle>
                      <DropdownMenu align="start">
                        <div className="p-2">
                          {filters.map((filter, idx) => (
                            <FormCheck
                              label={filter}
                              className={clsx({ 'mb-2': filters.length - 1 != idx })}
                              id={`filter-${idx}`}
                              key={idx}
                              defaultChecked
                            />
                          ))}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                  <Col xs="auto">
                    <button type="button" className="btn btn-primary">
                      <IconifyIcon icon="fa6-solid:plus" className="me-1" /> Add Contact
                    </button>
                  </Col>
                </form>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="pt-0">
            <ContactListTable contacts={contacts} />
          </CardBody>
        </Card>
      </Col>
    </Row>
    </>
  )
}

export default Contacts
