'use client';

import React, { useState } from 'react';
import QuestionLayout from '../QuestionLayout/QuestionLayout';
import { Card, Button, Row, Col } from 'react-bootstrap';

const QuestionLayoutExample: React.FC = () => {
  const [sections, setSections] = useState([
    {
      id: 'section-1',
      title: 'Dados Pessoais',
      description: 'Informações básicas do candidato',
      groups: [
        {
          id: 'group-1',
          name: 'Identificação',
          questions: [
            { id: 'q1', title: 'Nome completo', type: 'Texto', required: true },
            { id: 'q2', title: 'Data de nascimento', type: 'Data', required: true },
            { id: 'q3', title: 'CPF', type: 'Texto', required: true }
          ]
        },
        {
          id: 'group-2',
          name: 'Contato',
          questions: [
            { id: 'q4', title: 'E-mail', type: 'E-mail', required: true },
            { id: 'q5', title: 'Telefone', type: 'Telefone', required: false },
            { id: 'q6', title: 'Endereço', type: 'Texto', required: false }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Formação Acadêmica',
      description: 'Dados sobre sua formação',
      groups: [
        {
          id: 'group-3',
          name: 'Graduação',
          questions: [
            { id: 'q7', title: 'Instituição de ensino', type: 'Texto', required: true },
            { id: 'q8', title: 'Curso', type: 'Texto', required: true },
            { id: 'q9', title: 'Ano de conclusão', type: 'Número', required: true }
          ]
        },
        {
          id: 'group-4',
          name: 'Pós-graduação',
          questions: [
            { id: 'q10', title: 'Possui pós-graduação?', type: 'Sim/Não', required: false },
            { id: 'q11', title: 'Área de especialização', type: 'Texto', required: false }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Experiência Profissional',
      groups: [
        {
          id: 'group-5',
          name: 'Empresa Atual',
          questions: [
            { id: 'q12', title: 'Nome da empresa', type: 'Texto', required: true },
            { id: 'q13', title: 'Cargo', type: 'Texto', required: true },
            { id: 'q14', title: 'Tempo de empresa', type: 'Texto', required: true }
          ]
        }
      ]
    }
  ]);

  const [readonly, setReadonly] = useState(false);

  const handleSectionsChange = (newSections: any[]) => {
    setSections(newSections);
    console.log('Novo estrutura:', newSections);
  };

  const addNewSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Nova Seção ${sections.length + 1}`,
      description: 'Descrição da nova seção',
      groups: [
        {
          id: `group-${Date.now()}`,
          name: 'Novo Grupo',
          questions: [
            {
              id: `q-${Date.now()}`,
              title: 'Nova Pergunta',
              type: 'Texto',
              required: false
            }
          ]
        }
      ]
    };
    setSections([...sections, newSection]);
  };

  const exportStructure = () => {
    const dataStr = JSON.stringify(sections, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'question-structure.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col>
          <h2>Exemplo de Layout de Perguntas</h2>
          <p className="text-muted">
            Arraste e solte para reorganizar seções, grupos e perguntas
          </p>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button
              variant={readonly ? "primary" : "outline-primary"}
              onClick={() => setReadonly(!readonly)}
            >
              {readonly ? "Modo Edição" : "Modo Leitura"}
            </Button>
            <Button
              variant="success"
              onClick={addNewSection}
              disabled={readonly}
            >
              Adicionar Seção
            </Button>
            <Button
              variant="info"
              onClick={exportStructure}
            >
              Exportar Estrutura
            </Button>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <QuestionLayout
            sections={sections}
            onSectionsChange={handleSectionsChange}
            readonly={readonly}
          />
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>
          <h5>Estrutura Atual (JSON)</h5>
        </Card.Header>
        <Card.Body>
          <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(sections, null, 2)}
          </pre>
        </Card.Body>
      </Card>
    </div>
  );
};

export default QuestionLayoutExample;