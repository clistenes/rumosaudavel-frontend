'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, Button, Badge } from 'react-bootstrap';
import IconifyIcon from '../wrappers/IconifyIcon';
import styles from './QuestionLayout.module.css';

export interface Question {
  id: string;
  title: string;
  type: string;
  required?: boolean;
}

export interface Group {
  id: string;
  name: string;
  questions: Question[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  groups: Group[];
}

interface QuestionLayoutProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  readonly?: boolean;
}

const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  sections,
  onSectionsChange,
  readonly = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id))
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(sections.flatMap(s => s.groups.map(g => g.id)))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || readonly) return;

    const { source, destination, type } = result;

    if (type === 'SECTION') {
      const newSections = Array.from(sections);
      const [moved] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, moved);
      onSectionsChange(newSections);
      return;
    }

    if (type === 'GROUP') {
      const newSections = [...sections];
      const sourceSection = newSections.find(s => 
        s.groups.some(g => g.id === source.droppableId)
      );
      const destSection = newSections.find(s => 
        s.groups.some(g => g.id === destination.droppableId)
      );

      if (!sourceSection || !destSection) return;

      const sourceGroupIndex = sourceSection.groups.findIndex(g => g.id === source.droppableId);
      const destGroupIndex = destSection.groups.findIndex(g => g.id === destination.droppableId);

      if (sourceSection === destSection) {
        const newGroups = Array.from(sourceSection.groups);
        const [moved] = newGroups.splice(source.index, 1);
        newGroups.splice(destination.index, 0, moved);
        sourceSection.groups = newGroups;
      } else {
        const [moved] = sourceSection.groups.splice(sourceGroupIndex, 1);
        destSection.groups.splice(destGroupIndex, 0, moved);
      }

      onSectionsChange(newSections);
      return;
    }

    if (type === 'QUESTION') {
      const newSections = [...sections];
      
      const findGroupAndSection = (groupId: string) => {
        for (const section of newSections) {
          const groupIndex = section.groups.findIndex(g => g.id === groupId);
          if (groupIndex !== -1) {
            return { section, group: section.groups[groupIndex], groupIndex };
          }
        }
        return null;
      };

      const sourceInfo = findGroupAndSection(source.droppableId);
      const destInfo = findGroupAndSection(destination.droppableId);

      if (!sourceInfo || !destInfo) return;

      const [moved] = sourceInfo.group.questions.splice(source.index, 1);
      
      if (sourceInfo.group.id === destInfo.group.id) {
        sourceInfo.group.questions.splice(destination.index, 0, moved);
      } else {
        destInfo.group.questions.splice(destination.index, 0, moved);
      }

      onSectionsChange(newSections);
    }
  };

  const renderQuestion = (question: Question, index: number, groupId: string) => (
    <Draggable key={question.id} draggableId={question.id} index={index} isDragDisabled={readonly}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.questionCard} p-3 mb-2 border rounded ${
            snapshot.isDragging ? styles.dragging : ''
          } ${snapshot.isDropAnimating ? 'opacity-50' : ''}`}
          style={{
            ...provided.draggableProps.style,
            cursor: readonly ? 'default' : 'grab'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              {!readonly && (
                <div className={`text-muted ${styles.dragHandle}`}>
                  <IconifyIcon icon="mdi:drag" width="20" height="20" />
                </div>
              )}
              <div>
                <div className="fw-medium">{question.title}</div>
                <small className="text-muted">{question.type}</small>
              </div>
            </div>
            {question.required && (
              <Badge bg="danger" className={styles.badgeSm}>Obrigatório</Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderGroup = (group: Group, sectionIndex: number, groupIndex: number) => (
    <Draggable key={group.id} draggableId={group.id} index={groupIndex} isDragDisabled={readonly}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
        >
          <Card className={`mb-3 ${styles.groupCard} ${
            snapshot.isDragging ? styles.dragging : ''
          }`}>
            <Card.Header 
              className="d-flex align-items-center justify-content-between bg-light"
              style={{ cursor: readonly ? 'default' : 'grab' }}
            >
              <div className="d-flex align-items-center gap-2">
                {!readonly && (
                  <div className={`text-muted ${styles.dragHandle}`} {...provided.dragHandleProps}>
                    <IconifyIcon icon="mdi:drag" width="20" height="20" />
                  </div>
                )}
                <h6 className="mb-0">{group.name}</h6>
                <Badge bg="secondary">{group.questions.length} perguntas</Badge>
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => toggleGroup(group.id)}
                className="p-0 text-muted"
              >
                <IconifyIcon 
                  icon={expandedGroups.has(group.id) ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  width="20" 
                  height="20" 
                />
              </Button>
            </Card.Header>
            {expandedGroups.has(group.id) && (
              <Card.Body className="p-3">
                <Droppable droppableId={group.id} type="QUESTION" isDropDisabled={readonly}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.minHeight50} ${
                        snapshot.isDraggingOver ? 'bg-light rounded' : ''
                      }`}
                    >
                      {group.questions.map((question, index) => 
                        renderQuestion(question, index, group.id)
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card.Body>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );

  const renderSection = (section: Section, index: number) => (
    <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={readonly}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
        >
          <Card className={`mb-4 ${styles.sectionCard} ${
            snapshot.isDragging ? styles.dragging : ''
          }`}>
            <Card.Header 
              className="bg-primary text-white"
              style={{ cursor: readonly ? 'default' : 'grab' }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  {!readonly && (
                    <div className={`text-white ${styles.dragHandle}`} {...provided.dragHandleProps}>
                      <IconifyIcon icon="mdi:drag" width="20" height="20" />
                    </div>
                  )}
                  <div>
                    <h5 className="mb-0">{section.title}</h5>
                    {section.description && (
                      <small className="opacity-75">{section.description}</small>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark">
                    {section.groups.length} grupos
                  </Badge>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleSection(section.id)}
                    className="p-0 text-white"
                  >
                    <IconifyIcon 
                      icon={expandedSections.has(section.id) ? "mdi:chevron-up" : "mdi:chevron-down"} 
                      width="20" 
                      height="20" 
                    />
                  </Button>
                </div>
              </div>
            </Card.Header>
            {expandedSections.has(section.id) && (
              <Card.Body className="p-3">
                <Droppable droppableId={section.id} type="GROUP" isDropDisabled={readonly}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.minHeight100} ${
                        snapshot.isDraggingOver ? 'bg-light rounded p-2' : ''
                      }`}
                    >
                      {section.groups.map((group, groupIndex) => 
                        renderGroup(group, index, groupIndex)
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card.Body>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );

  if (readonly) {
    return (
      <div>
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections" type="SECTION" direction="vertical">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.questionLayout} ${styles.minHeight200} ${
              snapshot.isDraggingOver ? styles.draggingOver : ''
            } ${readonly ? styles.readonly : ''}`}
          >
            {sections.map((section, index) => renderSection(section, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuestionLayout;