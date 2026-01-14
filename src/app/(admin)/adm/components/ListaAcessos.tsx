"use client";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import Table from "react-bootstrap/Table";
import React, { useState } from "react";
import { usuarioData } from "../lista-acessos/data";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import EditUserModal from "./EditModal";
import { FormUser, Usuario } from "../types";
import { set } from "react-hook-form";
import DeleteUserModal from "./DeleteModal";
import CreateUserModal from "./CreateUserModal";
import { Button } from "react-bootstrap";
import { formatDateTime } from "@/utils/format-date";

export const ListaAcessos = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuarioData);
  const [selectedUser, setSelectedUser] = useState<Usuario>({
    nome: "",
    login: "",
    id: 0,
    criacao: "",
    senha: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateUser = (data: FormUser) => {
    const newUser: Usuario = {
      id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
      nome: data.nome,
      login: data.login,
      criacao: formatDateTime(new Date()),
    };
    setUsuarios((prevUsers) => [...prevUsers, newUser]);
    setShowCreateModal(false);
  };

  const handleEditClick = (user: Usuario) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = (data: FormUser) => {
    if (!selectedUser) return;

    setUsuarios((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, nome: data.nome, login: data.login }
          : user
      )
    );
    setShowEditModal(false);
    setSelectedUser({ nome: "", login: "", id: 0, criacao: "", senha: "" });
  };

  const handleDeleteClick = (user: Usuario) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsuarios((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser.id)
    );

    setShowDeleteModal(false);
    setSelectedUser({ nome: "", login: "", id: 0, criacao: "", senha: "" });
  };

  return (
    <ComponentContainerCard title="">
      <div className="table-responsive">
        <Table className="mb-0 table-centered">
          <thead className="table-light">
            <tr>
              <th >Nome</th>
              <th>Login</th>
              <th>Criação</th>
              <th className="actions-column"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((item, idx) => (
              <tr key={idx}>
                <td>{item.nome}</td>
                <td>{item.login}</td>
                <td>{item.criacao}</td>

                <td className="actions-column">
                  <IconifyIcon
                    icon="iconoir:edit-pencil"
                    className="fs-18 m-1 align-text-bottom text-primary"
                    onClick={() => handleEditClick(item)}
                  />
                  <IconifyIcon
                    icon="iconoir:trash"
                    className="fs-18 m-1 align-text-bottom text-primary"
                    onClick={() => handleDeleteClick(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-3">
          <Button className="" onClick={() => setShowCreateModal(true)}>
            Novo usuário
          </Button>
        </div>
      </div>
      {showEditModal && (
        <EditUserModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => {
            handleSaveUser(data);
          }}
          user={selectedUser}
        />
      )}

      {showDeleteModal && (
        <DeleteUserModal
          show={showDeleteModal}
          usuarioNome={selectedUser.nome}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteUser}
        />
      )}
      {showCreateModal && (
        <CreateUserModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateUser}
        />
      )}
    </ComponentContainerCard>
  );
};
