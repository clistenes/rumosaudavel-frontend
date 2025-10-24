import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import { visits } from '../data'

const Visits = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Browser Used &amp; Traffic Reports</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive browser_users">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-top-0">Channel</th>
                <th className="border-top-0">Sessions</th>
                <th className="border-top-0">Prev.Period</th>
                <th className="border-top-0">% Change</th>
              </tr>
            </thead>
            <tbody>

              {
                visits.map((item, idx) => (
                  <tr key={idx}>
                    <td><a href='' className="text-primary">{item.name}</a></td>
                    <td>{item.sessions.amount}<small className="text-muted">({item.sessions.percentage})</small></td>
                    <td>{item.period.amount}<small className="text-muted">({item.period.percentage})</small></td>
                    {
                      item.changeVariant == 'success' ?
                        <td> {item.change}% <i className="fas fa-caret-up text-success font-16" /></td>
                        :
                        <td> -{item.change}% <i className="fas fa-caret-down text-danger font-16" /></td>
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default Visits