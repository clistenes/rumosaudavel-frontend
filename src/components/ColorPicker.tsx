'use client'

import { useState, useCallback } from 'react'
import { Form } from 'react-bootstrap'

interface ColorPickerProps {
  label?: string
  value?: string
  onChange?: (color: string) => void
}

export default function ColorPicker({ 
  label = 'Cor', 
  value = '#FF6600',
  onChange 
}: ColorPickerProps) {
  const [color, setColor] = useState(value)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    if (onChange) {
      onChange(newColor)
    }
  }, [onChange])

  const presetColors = [
    '#FF6600', // Laranja (Rumo Saudável)
    '#00AA00', // Verde
    '#FF0000', // Vermelho
    '#FFCC00', // Amarelo
    '#0066CC', // Azul
    '#9900CC', // Roxo
    '#FF6699', // Rosa
    '#333333', // Preto
  ]

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      
      <div className="d-flex align-items-center gap-2 mb-2">
        <Form.Control
          type="color"
          value={color}
          onChange={handleChange}
          style={{ width: '60px', height: '40px', padding: '2px' }}
        />
        <Form.Control
          type="text"
          value={color}
          onChange={handleChange}
          placeholder="#FF6600"
          style={{ width: '100px' }}
        />
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: color,
            border: '2px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <div className="d-flex gap-2 flex-wrap mt-2">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            onClick={() => {
              setColor(presetColor)
              if (onChange) onChange(presetColor)
            }}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: presetColor,
              border: color === presetColor ? '3px solid #333' : '2px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title={presetColor}
          />
        ))}
      </div>
    </Form.Group>
  )
}
