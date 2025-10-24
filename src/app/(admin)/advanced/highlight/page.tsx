import ComponentContainerCard from '@/components/ComponentContainerCard'
import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import HighlightCode from './components/HighlightCode'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Highlight' }

const HtmlHighlights = () => {
  const code = (
    <>
      &lt;div class=&quot;card-header&quot;&gt;{'\n'}
      {'    '}&lt;h4 class=&quot;card-title&quot;&gt;Highlight HTML&lt;/h4&gt;{'\n'}
      {'    '}&lt;p class=&quot;text-muted mb-0&quot;&gt;Escape code&lt;/p&gt;{'\n'}&lt;/div&gt;{'\n'}
    </>
  )
  return (
    <ComponentContainerCard title="HTML Code">
      <HighlightCode language="html" code={code} />
    </ComponentContainerCard>
  )
}

const CssHighlight = () => {
  const code = <>font-family : &apos;Be Vietnam Pro&apos;, sans-serif;{'\n'}</>
  return (
    <ComponentContainerCard title="Css Code">
      <HighlightCode code={code} language="css" />
    </ComponentContainerCard>
  )
}

const JavascriptCodeHighlight = () => {
  const code = (
    <>
      {' '}
      Dropdown stop{'\n'}var dropdownMenus = document.querySelectorAll(&apos;.dropdown-menu.stop&apos;);{'\n'}
      {'    '}dropdownMenus.forEach(function(dropdownMenu) {'{'}
      {'\n'}
      {'        '}dropdownMenu.addEventListener(&apos;click&apos;, function(event) {'{'}
      {'\n'}
      {'        '}event.stopPropagation();{'\n'}
      {'    '}
      {'}'});{'\n'}
      {'}'});{'\n'}
    </>
  )
  return (
    <ComponentContainerCard title="Css Code">
      <HighlightCode code={code} language="javascript" />
    </ComponentContainerCard>
  )
}

const Highlight = () => {
  return (
    <>
    <PageTitle title='Highlight' subName='Advanced UI' />
    <Row className="justify-content-center">
      <Col md={6}>
        <HtmlHighlights />
        <CssHighlight />
      </Col>
      <Col md={6}>
        <JavascriptCodeHighlight />
      </Col>
    </Row>
    </>
  )
}

export default Highlight
