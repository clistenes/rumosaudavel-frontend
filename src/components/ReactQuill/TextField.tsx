"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyle} from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import { Controller, Control, FieldError } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

type Props = {
  name: string;
  label?: string;
  control: Control<any>;
  error?: FieldError;
};

export default function TextField({
  name,
  label,
  control,
  error,
}: Props) {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const editor = useEditor({
            extensions: [
              StarterKit,
              TextStyle,
              FontFamily,
              Underline,
              Subscript,
              Superscript,
              TextAlign.configure({
                types: ["heading", "paragraph"],
              }),
            ],
            content: field.value || "",
            immediatelyRender: false,
            onUpdate: ({ editor }) => {
              field.onChange(editor.getHTML());
            },
          });

          return (
            <div className={`border rounded ${error ? "border-danger" : ""}`}>
              {editor && (
                <div className="border-bottom p-2 bg-light d-flex flex-wrap gap-2">

                  {/* Fonte */}
                  <Dropdown>
                    <Dropdown.Toggle size="sm" variant="outline-secondary">
                      A
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {["Arial", "Times New Roman", "Courier New"].map(
                        (font) => (
                          <Dropdown.Item
                            key={font}
                            onClick={() =>
                              editor.chain().focus().setFontFamily(font).run()
                            }
                          >
                            {font}
                          </Dropdown.Item>
                        )
                      )}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Undo / Redo */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() => editor.chain().focus().undo().run()}
                    >
                      ↺
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => editor.chain().focus().redo().run()}
                    >
                      ↻
                    </Button>
                  </ButtonGroup>

                  {/* Texto */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleBold().run()
                      }
                    >
                      B
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                    >
                      I
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                      }
                    >
                      S
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                    >
                      U
                    </Button>
                  </ButtonGroup>

                  {/* Sub / Super */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleSubscript().run()
                      }
                    >
                      A₂
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleSuperscript().run()
                      }
                    >
                      A²
                    </Button>
                  </ButtonGroup>

                  {/* Títulos */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().setParagraph().run()
                      }
                    >
                      ¶
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                    >
                      H1
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                    >
                      H2
                    </Button>
                  </ButtonGroup>

                  {/* Alinhamento */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                      }
                    >
                      ≡
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                      }
                    >
                      ≣
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                      }
                    >
                      ≡
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().setTextAlign("justify").run()
                      }
                    >
                      ☰
                    </Button>
                  </ButtonGroup>

                  {/* Listas */}
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                    >
                      ••
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                    >
                      1.
                    </Button>
                  </ButtonGroup>

                  {/* Limpar */}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() =>
                      editor.chain().focus().clearNodes().unsetAllMarks().run()
                    }
                  >
                    Tx
                  </Button>
                </div>
              )}

              <EditorContent
                editor={editor}
                className="p-3"
                style={{ minHeight: 220 }}
              />
            </div>
          );
        }}
      />

      {error && (
        <div className="text-danger small mt-1">{error.message}</div>
      )}
    </Form.Group>
  );
}
