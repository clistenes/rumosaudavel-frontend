"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema } from "../../adm/Schemas";

import { InferType } from "yup";

export type EditUserFormData = InferType<typeof editUserSchema>;


interface EditUserModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: EditUserFormData) => void;
  user: {
    nome: string;
    login: string;
  };
}

export default function EditUserModal({
  show,
  onClose,
  onSave,
  user,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      nome: user.nome,
      login: user.login,
      senha: "",
    },
  });

  useEffect(() => {
    if (show) {
      reset({
        nome: user.nome,
        login: user.login,
        senha: "",
      });
    }
  }, [show, user, reset]);

  const onSubmit = (data: EditUserFormData) => {
    if (!data.senha) delete data.senha; // não envia se vazio
    onSave(data);
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuário</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                    {...register("nome")}
                  />
                  <div className="invalid-feedback">
                    {errors.nome?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Login</label>
                  <input
                    type="text"
                    className={`form-control ${errors.login ? "is-invalid" : ""}`}
                    {...register("login")}
                  />
                  <div className="invalid-feedback">
                    {errors.login?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nova Senha</label>
                  <input
                    type="password"
                    className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                    {...register("senha")}
                    placeholder="Deixe em branco para não alterar"
                  />
                  <div className="invalid-feedback">
                    {errors.senha?.message}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
