import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageTitle from "@/components/PageTitle";
import React from "react";
import { Row, Table } from "react-bootstrap";
import { usuarioData } from "./data";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import EditUserModal from "../components/EditModal";
import { ListaAcessos } from "../components/ListaAcessos";

export const metadata = { title: "Todos Questionários" };
const TodosQuestionarios = () => {
  return (
    <>
      <PageTitle title="Todos Questionários" subName="Questionários" />
      <Row>
        <ListaAcessos />
      </Row>
    </>
  );
};

export default TodosQuestionarios;
