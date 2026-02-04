"use client";
import QuestionLayout, {
  Section,
} from "@/components/QuestionLayout/QuestionLayout";
import React, { useState } from "react";

export const TesteLayout = () => {
  const [sections, setSections] = useState<Section[]>([
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

  return (
    <div>
      <QuestionLayout
        sections={sections}
        onSectionsChange={setSections}
        readonly={false}
      />
    </div>
  );
};
