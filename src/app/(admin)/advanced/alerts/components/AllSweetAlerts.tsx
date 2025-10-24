'use client'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import logoSm from '@/assets/images/logo-sm.png'
import { toSentenceCase } from '@/utils/change-casing'
import { iconAlerts } from '../data'
import withReactContent from 'sweetalert2-react-content'

import Swal, { SweetAlertOptions } from "sweetalert2";

const ReactSwal = withReactContent(Swal)

const openAlert = (options: SweetAlertOptions) => {
  ReactSwal.fire(options)
}


const AllSweetAlerts = (() => {
  return (
    <>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as="h4">Trigger Modal And Trigger Toast</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  openAlert({
                    title: 'Dastone!',
                    text: 'Modal with a Brand Logo.',
                    imageUrl: logoSm.src,
                    imageWidth: 80,
                    imageHeight: 80,
                    imageAlt: 'Custom image',
                  })
                }
                className="me-1">
                Trigger modal
              </Button>
              <Button
                variant="primary"
                size="sm"
                data-swal-toast-template="#my-template"
                onClick={() => {
                  openAlert({
                      toast: true,
                      title: 'Dastone!',
                      text: 'Toast example',
                      showCancelButton: true,
                    })
                }}>
                Trigger toast
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Icons</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {iconAlerts.map((alert, idx) => {
                return (
                  <Button
                    className="me-1"
                    variant={alert.variant === 'error' ? 'danger' : alert.variant}
                    key={idx}
                    type="button"
                    size="sm"
                    onClick={() =>
                      openAlert({
                        title: alert.title,
                        text: alert.text,
                        timer: alert.timer,
                      })
                    }>
                    {toSentenceCase(alert.variant)}
                  </Button>
                )
              })}
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  openAlert({
                    icon: 'question',
                    title: 'Oops...',
                    text: 'Icon question!',
                  })
                }>
                {' '}
                Question
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Examples</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <tbody>
                    <tr className="border-0">
                      <td className="border-0">A basic message</td>
                      <td className="border-0">
                        <Button variant="primary" size="sm" onClick={() => openAlert({ title: 'Any fool can use a computer' })}>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A title with a text under</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              title: 'The Internet?',
                              text: 'That thing is still around?',
                              icon: 'question',
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A modal with a title, an error icon, a text, and a footer</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                              footer: '<a href>Why do I have this issue?</a>',
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">Custom HTML description and buttons with ARIA labels</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              title: '<b>HTML</b> <u>example</u>',
                              icon: 'info',
                              html: 'You can use <b>bold text</b>, ' + '<a href="https://Mannatthemes.com/">links</a> ' + 'and other HTML tags',
                              showCloseButton: true,
                              showCancelButton: true,
                              cancelButtonText: `Cancel`,
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A dialog with three buttons</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                                title: 'Do you want to save the changes?',
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: `Save`,
                                denyButtonText: `Don't save`,
                              })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A custom positioned dialog</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              position: 'top-end',
                              icon: 'success',
                              title: 'Your work has been saved',
                              showConfirmButton: false,
                              timer: 1500,
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">Custom animation with Animation</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              title: 'Custom animation with Animate.css',
                              showClass: {
                                popup: 'animate__animated animate__fadeInDown',
                              },
                              hideClass: {
                                popup: 'animate__animated animate__fadeOutUp',
                              },
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A confirm dialog, with a function attached to the &quot;Confirm&quot;-button...</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes, delete it!',
                              })
                              .then(function (result: any) {
                                if (result.isConfirmed) {
                                  ReactSwal.fire('Deleted!', 'Your file has been deleted.', 'success')
                                }
                              })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">... and by passing a parameter, you can execute something else for &quot;Cancel&quot;.</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, delete it!',
                                cancelButtonText: 'No, cancel!',
                                reverseButtons: true,
                              })
                              .then((result: any) => {
                                if (result.isConfirmed) {
                                  ReactSwal.fire('Deleted!', 'Your file has been deleted.', 'success')
                                } else if (
                                  /* Read more about handling dismissals below */
                                  result.dismiss === ReactSwal.DismissReason.cancel
                                ) {
                                  ReactSwal.fire('Cancelled', 'Your imaginary file is safe :)', 'error')
                                }
                              })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A message with a custom image</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                              title: 'Dastone!',
                              text: 'Modal with a Brand Logo.',
                              imageUrl: logoSm.src,
                              imageWidth: 80,
                              imageHeight: 80,
                              imageAlt: 'Custom image',
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A message with custom width, padding, background and animated Nyan Cat</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              title: 'Custom width, padding, background.',
                              width: 600,
                              padding: 50,
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">A message with auto close timer</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                                title: 'Auto close alert!',
                                html: 'I will close in <b></b> milliseconds.',
                                timer: 2000,
                                timerProgressBar: true,
                                didOpen: () => {
                                  ReactSwal.showLoading()
                                  const b = ReactSwal.getHtmlContainer()?.querySelector('b');
                                 
                                  
                                },
                               
                              })
                              .then((result: any) => {
                                /* Read more about handling dismissals below */
                                if (result.dismiss === ReactSwal.DismissReason.timer) {
                                  console.log('I was closed by the timer')
                                }
                              })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">Right-to-left support for Arabic, Persian, Hebrew, and other RTL languages</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            openAlert({
                              title: 'هل تريد الاستمرار؟',
                              icon: 'question',
                              iconHtml: '؟',
                              confirmButtonText: 'نعم',
                              cancelButtonText: 'لا',
                              showCancelButton: true,
                              showCloseButton: true,
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">AJAX request example</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                                title: 'Submit your Github username',
                                input: 'text',
                                inputAttributes: {
                                  autocapitalize: 'off',
                                },
                                showCancelButton: true,
                                confirmButtonText: 'Look up',
                                showLoaderOnConfirm: true,
                                preConfirm: (login: string) => {
                                  return fetch(`//api.github.com/users/${login}`)
                                    .then((response) => {
                                      if (!response.ok) {
                                        throw new Error(response.statusText)
                                      }
                                      return response.json()
                                    })
                                    .catch((error) => {
                                      ReactSwal.showValidationMessage(`Request failed: ${error}`)
                                    })
                                },
                                allowOutsideClick: () => !ReactSwal.isLoading(),
                              })
                              .then((result: any) => {
                                if (result.isConfirmed) {
                                  openAlert({
                                    title: `${result.value.login}'s avatar`,
                                    imageUrl: result.value.avatar_url,
                                  })
                                }
                              })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-0">
                      <td className="border-0">Mixin example</td>
                      <td className="border-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            ReactSwal.fire({
                              icon: 'success',
                              title: 'Signed in successfully',
                            })
                          }>
                          Click me
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
})

export default AllSweetAlerts
