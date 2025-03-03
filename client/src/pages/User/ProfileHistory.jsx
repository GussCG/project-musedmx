import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import Icons from "../../components/IconProvider";
const { LuArrowUpDown, eliminarIcon, verIcon } = Icons;

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileHistory() {
  // Definimos estado para el historial de visitas
  const [visitas, setVisitas] = useState([]);
  const { user } = useAuth();

  const resenasPrueba = [
    {
      id: 1,
      museo: "Museo Nacional de Antropología e Historia",
      usuario: "mail@mail.com",
      fecHr: "30-04-2024 12:00",
      comentario: "Excelente museo",
      moderadorAprobo: "mail@mod.com",
      status: false,
      calificacion: 5,
    },
    {
      id: 2,
      museo: "Museo Perfume",
      usuario: "mail@mail.com",
      fecHr: "30-04-2024 12:01",
      comentario: "Excelente museo 2",
      moderadorAprobo: "mail@mod.com",
      status: true,
      calificacion: 3,
    },
  ];

  useEffect(() => {
    setVisitas(resenasPrueba);
  }, []);

  // Funcion para eliminar una visita del historial
  const eliminarVisita = (id) => {
    // Hacemos una petición DELETE al backend para eliminar la visita
    // De momento no se ha implementado el backend entonces se muestra un mensaje de alerta
    // axios
    //   .delete(`/api/usuario/historial/${id}`)
    //   .then((response) => {
    //     // Actualizamos el estado de visitas
    //     setVisitas(visitas.filter((visita) => visita.id !== id));
    //     alert("Visita eliminada");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    toast.success(`Visita Eliminada`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  // Cargamos el historial de visitas del usuario
  useEffect(() => {
    // Hacemos una petición GET al backend para obtener el historial de visitas
    // Para el desarrollo local tenemos datos de prueba
    // axios
    //   .get("/api/usuario/historial")
    //   .then((response) => {
    //     setVisitas(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    setVisitas(resenasPrueba);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "fecHr",
        header: "Fecha de la visita",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "museo",
        header: "Museo",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "calificacion",
        header: "Calificación",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: (info) => (
          <span className={info.getValue() ? "aprobada" : "pendiente"}>
            {info.getValue() ? "Aprobado" : "Pendiente"}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "ver",
        header: "Ver",
        cell: (info) => (
          <Link to={`./${info.row.index}`}>
            <img src={verIcon} alt="Ver" />
          </Link>
        ),
        enableSorting: false,
      },
      {
        id: "eliminar",
        header: "Borrar",
        cell: (info) => (
          <button onClick={() => eliminarVisita(info.row.index)}>
            <img src={eliminarIcon} alt="Eliminar" />
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: visitas,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <main id="tabla-main">
        <h1>Historial de Visitas</h1>
        <div className="tabla-container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ cursor: "pointer" }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.columnDef.enableSorting ? (
                          <LuArrowUpDown />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {/* Aquí se deberá hacer un map de las visitas del usuario */}
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default ProfileHistory;
