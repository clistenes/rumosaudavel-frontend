'use client'
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'

const CheckAndRadioButtons = () => {
  return (
    <ComponentContainerCard title="Check And Radio Buttons">
      <ToggleButtonGroup type="checkbox" className="mb-2 mb-lg-0">
        <ToggleButton variant="outline-primary" id="tbg-check-1" value={1}>
          Checkbox 1
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="tbg-check-2" value={2}>
          Checkbox 2
        </ToggleButton>
        <ToggleButton variant="outline-primary" id="tbg-check-3" value={3}>
          Checkbox 3
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup type="radio" name="options" className="float-end" defaultValue={1}>
        <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1}>
          Radio 1
        </ToggleButton>
        <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2}>
          Radio 2
        </ToggleButton>
        <ToggleButton variant="outline-secondary" id="tbg-radio-3" value={3}>
          Radio 3
        </ToggleButton>
      </ToggleButtonGroup>
    </ComponentContainerCard>
  )
}

export default CheckAndRadioButtons
