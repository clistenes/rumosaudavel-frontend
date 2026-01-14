"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { empresaSchema } from "../Schema";
import { EmpresaForm } from "../type";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import TextField from "@/components/ReactQuill/TextField";

export default function EmpresaFormComponent() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmpresaForm>({
    resolver: yupResolver(empresaSchema),
    defaultValues: {
      consentimento: false,
      camposPadrao: {
        nome: true,
        faixaEtaria: false,
      },
      camposCustomizados: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "camposCustomizados",
  });

  const onSubmit = (data: EmpresaForm) => {
    console.log("EMPRESA:", data);
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Criar empresa</h4>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dados básicos */}
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome da empresa</Form.Label>
                <Form.Control
                  {...register("nome")}
                  isInvalid={!!errors.nome}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Cor da empresa</Form.Label>
                <Form.Control type="color" {...register("cor")} />
              </Form.Group>
            </Col>

            <Col md={12}>
              <TextField 
                name="descricao"
                label="Descrição da empresa"
                control={control}
            
                error={errors.descricao}
              />
            </Col>
          </Row>

          {/* <hr /> */}

          <h5>Campos padrão</h5>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Check
                label="Nome"
                {...register("camposPadrao.nome")}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                label="Faixa etária"
                {...register("camposPadrao.faixaEtaria")}
              />
            </Col>
          </Row>

          {/* <hr /> */}

          {/* Consentimento */}
          <Form.Check
            className="mb-3"
            label="Aceito o termo de consentimento"
            {...register("consentimento")}
            isInvalid={!!errors.consentimento}
          />

          {/* <hr /> */}

          {/* Campos customizados */}
          <h5>Campos customizados</h5>

          {fields.map((field, index) => {
            const tipo = watch(`camposCustomizados.${index}.tipo`);

            return (
              <Card key={field.id} className="mb-3 border">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Label</Form.Label>
                        <Form.Control
                          {...register(
                            `camposCustomizados.${index}.label`
                          )}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                          {...register(
                            `camposCustomizados.${index}.tipo`
                          )}
                        >
                          <option value="dissertativa">
                            Dissertativa
                          </option>
                          <option value="objetiva">Objetiva</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {tipo === "objetiva" && (
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Opções</Form.Label>
                          <Form.Control
                            {...register(
                              `camposCustomizados.${index}.opcoes`
                            )}
                            placeholder="Separadas por vírgula"
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <div className="text-end mt-3">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remover campo
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}

          <Button
            variant="outline-primary"
            className="mb-3"
            onClick={() =>
              append({ label: "", tipo: "dissertativa", opcoes: null })
            }
          >
            + Adicionar campo customizado
          </Button>

          <div className="d-flex justify-content-end">
            <Button type="submit">Criar empresa</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
