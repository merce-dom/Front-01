import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BACKEND_SERVER } from '../../constantes';
import axios from 'axios';
import { Container, Row, Col, Table, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trash, PencilFill } from 'react-bootstrap-icons';
import EstSeccionFiltro from './est_seccion_filtro';

const EstSeccionLista = () => {
    const [token] = useCookies(['tec-token']);
    const [secciones, setSecciones] = useState([]);
    const [seccionBorrar, setSeccionBorrar] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [show, setShow] = useState(false);

    const actualizaFiltro = str => {
        setFiltro(str);
    }

    useEffect(()=>{
        axios.get(BACKEND_SERVER + '/api/estructura/seccion/' + filtro, {
            headers: {
                'Authorization': `token ${token['tec-token']}`
              }
        })
        .then(res => {
            // console.log(res.data);
            setSecciones(res.data);
        })
    },[token, filtro]);

    const handleTrashClick = (seccion) => {
        console.log(seccion.siglas);
        setSeccionBorrar(seccion);
        setShow(true);
    }

    const handleClose = () => setShow(false);

    const borrarSeccion = () => {
        console.log('Borrar ' + seccionBorrar.nombre);
        axios.delete(BACKEND_SERVER + `/api/estructura/seccion/${seccionBorrar.id}/`, {
            headers: {
                'Authorization': `token ${token['tec-token']}`
              }
            })
            .then(res => {
                // console.log(res);
                // Actualiza la lista de empresas
                const seccionesActual = secciones.filter(sec => sec.id !== seccionBorrar.id);
                setSecciones(seccionesActual);
                setShow(false);
                setSeccionBorrar(null);
            })
            .catch(err => {console.log(err);})
    }

    return ( 
        <Container>
            <Row>
                <Col xs="12" sm="4">
                    <EstSeccionFiltro actualizaFiltro={actualizaFiltro}/>
                </Col>
                <Col>
                    <h5 className="mb-3 mt-3">Lista de secciones</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Zona</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {secciones && secciones.map( sec => {
                                return (
                                    <tr key={sec.id}>
                                        <td>{sec.siglas_zona}</td>
                                        <td>{sec.nombre}</td>
                                        <td>
                                            <Link to={`/estructura/seccion/${sec.id}`}>
                                                <PencilFill className="mr-3 pencil"/>
                                            </Link>
                                            <Trash className="trash" onClick={event => {handleTrashClick(sec)}}/>
                                        </td>
                                    </tr>
                                )})
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={ false }>
                <Modal.Header closeButton>
                    <Modal.Title>Borrar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Está a punto de borrar la seccion: <strong>{seccionBorrar && seccionBorrar.nombre}</strong></Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={borrarSeccion}>
                        Borrar
                    </Button>
                    <Button variant="waring" onClick={handleClose}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
     );
}
 
export default EstSeccionLista;