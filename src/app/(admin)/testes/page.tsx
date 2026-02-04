import React from "react";
import { Row } from "react-bootstrap";
import { CreateEmpresa } from "../empresas/nova-empresa/components/CreateEmpresa";
import PageTitle from "@/components/PageTitle";
import { TesteLayout } from "./components/testeLayout";

 const Teste = () => {
  return (
    <>
      <PageTitle title="Teste" subName="Teste" />
      <Row>
       <TesteLayout /> 
      </Row>
    </>
  );
};
export default Teste;