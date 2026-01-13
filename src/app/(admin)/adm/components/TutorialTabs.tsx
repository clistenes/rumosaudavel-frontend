'use client'
import ComponentContainerCard from "@/components/ComponentContainerCard"
import { link } from "fs"
import { title } from "process"
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from "react-bootstrap"
const data = {
  questionarios : [
    {
      title: 'questionários cadastrados (onde estão os questionários cadastrados e como eles são listados.)', 
      link: 'https://www.youtube.com/embed/rJoz6sbVIu8?si=-XeLcZjD2VTEZZ-s'
    },
    {
       title: 'visualizar questionário (como visualizar um questionário e quais são as opções de controle)',
       link: 'https://www.youtube.com/embed/2cJiRt8piPM?si=vLQjA_cswFyMjEjO'
    },
    {
      title: 'cadastrar questionário (como cadastrar um questionário e adicionar perguntas variadas)',
      link: 'https://www.youtube.com/embed/TQss2y-8xKE?si=599P4KR-A1PgFLYi'
    },
    {
      title: 'apagar e recuperar questionário (como apagar e recuperar questionários?)',
      link: 'https://www.youtube.com/embed/7JjS1BDl2CA?si=Yf2TKH9WzmqwWqM-'
    },

    {
      title: 'nova pergunta (como cadastrar uma pergunta em um questionário pronto)',
      link: 'https://www.youtube.com/embed/Iu9E-G6edZI?si=ijvD1QJvGJ6Sb2iy'
    },
    {
      title: 'editar pergunta (como editar uma pergunta cadastrada)',
      link: 'https://www.youtube.com/embed/l54QUChix1s?si=52jbIBiyMBF0Jppz'
    },
    {
      title: 'pergunta dependente (como criar perguntas vinculadas à hipóteses)',
      link: 'https://www.youtube.com/embed/FPH9mpLBAdE?si=IzZQ8k6ylGXBgTrw'
    },
    {
      title: 'ordenar perguntas (como alterar a posição da pergunta?)',
      link: 'https://www.youtube.com/embed/lIsHnTH-uLw?si=V2UNogHTo8A6S2Td'
    }
  ],
  programas: [
    {
      title: "novo programa (como criar programs e configurar)",
      link: "https://www.youtube.com/embed/4KyVRcj9T28?si=4DEf2_GlLpA8RFtn"
    },
        
    {
      title: "editar programa (editar informação de um programa cadastrado)",
      link: "https://www.youtube.com/embed/TjPSXiL9tsA?si=d5MWzyrEcU-zdM78"
    },
    {
      title: "vincular empresa (vincular uma empresa a um programa)",
      link: "https://www.youtube.com/embed/ssUzc6NanOQ?si=xch_s4hSeCexSxBz"
    },
    {
      title: "configurar intervalo (intervalo que o programa está disponível para a empresa)",
      link: "https://www.youtube.com/embed/W3N4tEi-xOo?si=XvMC633e5SYUZGpR"
    },
  ],
  empresas: [
    {
      title: "nova empresa (como cadastrar empresas: cor, logotipo e campos personalizados)",
      link: "https://www.youtube.com/embed/VLOZlFetaTU"
    },
    {
      title: 	"visualizar e editar empresas (como cadastrar empresas: cor, logotipo e campos personalizados)",
      link: "https://www.youtube.com/embed/HKpeSHi3JBY"
    },
    {
      title: 	"novos logins (acessos de participntes) (como cadastrar logins e controlar acessos)",
      link: "https://www.youtube.com/embed/LY9AW-ItYw8"
    },
  ],
  areaAdm: [
    {
      title: "login e recuperação de senha (como acessar e alterar uma senha)",
      link: "https://www.youtube.com/embed/qPEtR0_X-Yg?si=Yzx9iIL1YvOvkDVv"
    },
    {
      title: "usuário administrativo e controle (como criar novos acessos, alterar o cadastro, senha e excluir usuários adm)",
      link: "https://www.youtube.com/embed/gye6Dhtec_c?si=Zl-hIduUXBOxYBQT"
    },
  ]

}
const TutorialTabs = () => {
  return (
    <ComponentContainerCard title="Clique nas áreas para visualizar os vídeos">
      <TabContainer defaultActiveKey="1">
        <Nav justify className="nav-pills" role="tablist">
          <NavItem>
            <NavLink eventKey="1" href="#home" role="tab">
              Questionários
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="2" href="#profile" role="tab">
              Programas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="3" href="#settings" role="tab">
              Empresas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="4" href="#settings" role="tab">
              Área adm
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent>
          <TabPane eventKey="1" className="p-3" id="home" role="tabpanel">
            <Accordion flush>
              {data.questionarios.map((item, idx) => {
                return (
                  <AccordionItem eventKey={`${idx}`} key={idx}>
                    <AccordionHeader as="h5" className="m-0">
                      <div className="fw-semibold">{item.title}</div>
                    </AccordionHeader>
                    <AccordionBody>
                    <iframe 
                      width='100%'
                      height='500'
                      src={item.link} 
                      title="YouTube video player" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen>

                    </iframe>
                    </AccordionBody>
                  </AccordionItem>
                )
              })}
            </Accordion>
       </TabPane>
          <TabPane eventKey="2" className="p-3" id="profile" role="tabpanel">
           <Accordion flush>
              {data.programas.map((item, idx) => {
                return (
                  <AccordionItem eventKey={`${idx}`} key={idx}>
                    <AccordionHeader as="h5" className="m-0">
                      <div className="fw-semibold">{item.title}</div>
                    </AccordionHeader>
                    <AccordionBody>
                    <iframe 
                      width='100%'
                      height='500'
                      src={item.link} 
                      title="YouTube video player" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen>

                    </iframe>
                    </AccordionBody>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabPane>
          <TabPane eventKey="3" className="p-3" id="settings" role="tabpanel">
            <Accordion flush>
              {data.empresas.map((item, idx) => {
                return ( 
                  <AccordionItem eventKey={`${idx}`} key={idx}>
                    <AccordionHeader as="h5" className="m-0">
                      <div className="fw-semibold">{item.title}</div>
                    </AccordionHeader>
                    <AccordionBody>
                    <iframe
                      width='100%'
                      height='500'
                      src={item.link}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen>
                    </iframe>
                    </AccordionBody>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabPane>
          <TabPane eventKey="4" className="p-3" id="settings" role="tabpanel">
            <Accordion flush>
              {data.areaAdm.map((item, idx) => {
                return ( 
                  <AccordionItem eventKey={`${idx}`} key={idx}>
                    <AccordionHeader as="h5" className="m-0">
                      <div className="fw-semibold">{item.title}</div>
                    </AccordionHeader>
                    <AccordionBody>
                    <iframe
                      width='100%'
                      height='500'
                      src={item.link}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen>
                    </iframe>
                    </AccordionBody>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabPane>
        </TabContent>
      </TabContainer>
    </ComponentContainerCard>
  )
}

export default TutorialTabs