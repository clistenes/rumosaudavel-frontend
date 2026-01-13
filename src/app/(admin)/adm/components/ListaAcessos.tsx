'use client';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import Table from 'react-bootstrap/Table';
import React, { useState } from 'react'
import { usuarioData } from '../lista-acessos/data';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import EditUserModal from './EditModal';

export const ListaAcessos = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ nome: string; login: string } >({ nome: '', login: '' });
    
    const handleEditClick = (user: { nome: string; login: string }) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    return (
    <ComponentContainerCard title="">
      <div className="table-responsive">
        <Table className="mb-0 table-centered">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>Criação</th>
              <th></th>
   
            </tr>
          </thead>
          <tbody>
            {usuarioData.map((item, idx) => (
              <tr key={idx}>
                <td>

                  {item.nome}
                </td>
                <td>
                  {item.login}
                </td>
                <td>{item.criacao}</td>
         
                <td className="">
                    <IconifyIcon icon="iconoir:edit-pencil" className="fs-18 m-1 align-text-bottom text-primary" onClick={() => handleEditClick(item)} />
                    <IconifyIcon icon="iconoir:trash" className="fs-18 m-1 align-text-bottom text-primary" />

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {showModal && (
        <EditUserModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            // Handle save logic here
            setShowModal(false);
          }}
          user={selectedUser} 
        />
      )}
    </ComponentContainerCard>
  )
}
