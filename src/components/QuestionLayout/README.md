# QuestionLayout Component

Um componente React com drag and drop para organizar perguntas em uma estrutura hierárquica de Seções → Grupos → Perguntas.

## Estrutura

```
Seção (Section)
├── Grupo (Group)
│   ├── Pergunta (Question)
│   ├── Pergunta (Question)
│   └── ...
├── Grupo (Group)
│   └── ...
└── ...
```

## Funcionalidades

- ✅ **Drag and Drop** completo entre todos os níveis
- ✅ **Reorganização** de seções, grupos e perguntas
- ✅ **Modo readonly** para visualização apenas
- ✅ **Colapsável** para melhor organização visual
- ✅ **Responsivo** e acessível
- ✅ **TypeScript** com tipagem completa

## Instalação

O componente utiliza as seguintes dependências (já incluídas no projeto):

```bash
npm install @hello-pangea/dnd react-bootstrap
```

## Uso Básico

```tsx
import QuestionLayout from '@/components/QuestionLayout/QuestionLayout';

const MyForm = () => {
  const [sections, setSections] = useState([
    {
      id: 'section-1',
      title: 'Dados Pessoais',
      description: 'Informações básicas',
      groups: [
        {
          id: 'group-1',
          name: 'Identificação',
          questions: [
            { id: 'q1', title: 'Nome', type: 'Texto', required: true },
            { id: 'q2', title: 'Email', type: 'E-mail', required: true }
          ]
        }
      ]
    }
  ]);

  return (
    <QuestionLayout
      sections={sections}
      onSectionsChange={setSections}
    />
  );
};
```

## Props

| Prop | Tipo | Descrição | Padrão |
|------|------|-----------|--------|
| `sections` | `Section[]` | Array de seções com grupos e perguntas | **Obrigatório** |
| `onSectionsChange` | `(sections: Section[]) => void` | Callback chamado quando a estrutura é alterada | **Obrigatório** |
| `readonly` | `boolean` | Desabilita drag and drop e edição | `false` |

## Tipos

```typescript
interface Question {
  id: string;
  title: string;
  type: string;
  required?: boolean;
}

interface Group {
  id: string;
  name: string;
  questions: Question[];
}

interface Section {
  id: string;
  title: string;
  description?: string;
  groups: Group[];
}
```

## Exemplo Completo

Veja o arquivo `QuestionLayoutExample.tsx` para um exemplo completo com:

- Adição de novas seções
- Modo edição/leitura
- Exportação da estrutura
- Visualização em tempo real do JSON

## Personalização

O componente utiliza CSS Modules através de `QuestionLayout.module.css`. Você pode personalizar:

- Cores e espaçamentos
- Animações de drag
- Estados de hover
- Layout responsivo

## Funcionalidades de Drag and Drop

### 1. Mover Perguntas
- **Dentro do mesmo grupo**: Reordena as perguntas
- **Entre grupos diferentes**: Move a pergunta para outro grupo

### 2. Mover Grupos
- **Dentro da mesma seção**: Reordena os grupos
- **Entre seções diferentes**: Move o grupo para outra seção

### 3. Mover Seções
- **Reordenação**: Altera a ordem das seções

## Acessibilidade

- Suporte a navegação por teclado
- Indicadores visuais de drag
- Feedback claro durante operações
- Modo readonly para usuários sem permissão de edição

## Performance

- Virtualização implícita através do @hello-pangea/dnd
- Otimizações de renderização
- Memoização adequada
- CSS eficiente com modules

## Contribuição

Para adicionar novas funcionalidades:

1. Mantenha a estrutura hierárquica
2. Preserve a tipagem TypeScript
3. Adicione testes quando necessário
4. Documente novas props

## Troubleshooting

### Problemas comuns

**Drag não funciona:**
- Verifique se não está em modo readonly
- Confirme se as dependências estão instaladas

**Performance lenta:**
- Evite estruturas muito aninhadas (>100 itens)
- Use IDs únicos e estáveis

**Estilos não aplicados:**
- Verifique a importação do CSS module
- Confirme se o Bootstrap está carregado