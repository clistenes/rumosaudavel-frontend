"use client";

import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreateUserForm, FormUser } from "../types";

interface CreateUserModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (data: FormUser) => void;
}

const schema = yup.object({
  nome: yup.string().required("Nome é obrigatório"),
  login: yup.string().required("Login é obrigatório"),
  senha: yup.string().required("Senha é obrigatória"),
});

const CreateUserModal = ({
  show,
  onClose,
  onCreate,
}: CreateUserModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormUser) => {
    onCreate(data);
    reset();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Criar usuário</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              {...register("nome")}
              isInvalid={!!errors.nome}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nome?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Login</Form.Label>
            <Form.Control
              {...register("login")}
              isInvalid={!!errors.login}
            />
            <Form.Control.Feedback type="invalid">
              {errors.login?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              {...register("senha")}
              isInvalid={!!errors.senha}
            />
            <Form.Control.Feedback type="invalid">
              {errors.senha?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Criar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
