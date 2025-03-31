import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import Icons from "../../components/IconProvider";
const { LuArrowUpDown, verIcon } = Icons;

import { motion } from "framer-motion";

import { Link, useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

function ModHistory() {
  // Obtener el museoId de la URL
  const { museoId } = useParams();
  const [museo, setMuseo] = useState({});

  // Buscamos los museos para obtener el nombre del museo y si hay museoId unicamente buscamos el museo con ese id
  //   useEffect(() => {
  //     // Hacemos una petición GET al backend para obtener los museos
  //     axios.get("/api/museos").then((response) => {
  //       if (museoId) {
  //         // Buscamos el museo con el id que se encuentra en la URL
  //         const museo = response.data.find((museo) => museo.id === museoId);
  //         setMuseo(museo);
  //       } else {
  //         setMuseos(response.data);
  //       }
  //     });
  //   }, []);

  // Definimos estado para el historial de visitas
  const [resenas, setResenas] = useState([]);

  // Visitas de prueba
  const resenasPrueba = [
    {
      id: 1,
      museo: "Museo Nacional de Antropología e Historia",
      usuario: "mail@mail.com",
      fecHr: "30-04-2024 12:00",
      comentario: "Excelente museo",
      moderadorAprobo: "",
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
    // Cargamos las reseñas
    setResenas(resenasPrueba);
  }, []);

  // Funcion para obtener las reseñas de los museos o de un museo en específico
  //   const obtenerResenas = async (museoId) => {
  //     if (museoId) {
  //       // Hacemos una petición GET al backend para obtener las reseñas de un museo en específico
  //       // axios
  //       //   .get(`/api/museo/${museoId}/resenas`)
  //       //   .then((response) => {
  //       //     setResenas(response.data);
  //       //   })
  //       //   .catch((error) => {
  //       //     console.log(error);
  //       //   });
  //     } else {
  //       // Hacemos una petición GET al backend para obtener todas las reseñas
  //       // axios
  //       //   .get(`/api/resenas`)
  //       //   .then((response) => {
  //       //     setResenas(response.data);
  //       //   })
  //       //   .catch((error) => {
  //       //     console.log(error);
  //       //   });
  //     }
  //   };

  const columns = useMemo(
    () => [
      {
        accessorKey: "usuario",
        header: "Usuario",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "fecHr",
        header: "Fecha de Reseña",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      ...(museoId
        ? []
        : [
            {
              accessorKey: "museo",
              header: "Museo",
              cell: (info) => info.getValue(),
              enableSorting: true,
            },
          ]),
      {
        accessorKey: "calificacion",
        header: "Calificación",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ getValue }) => (
          <span className={getValue() ? "aprobada" : "pendiente"}>
            {getValue() ? "Aprobada" : "Pendiente"}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "acciones",
        header: "Ver Detalles",
        cell: ({ row }) => (
          <Link to={`/Perfil/Mod/Resena/${row.original.id}`}>
            <img src={verIcon} alt="Ver" />
          </Link>
        ),
        enableSorting: false,
      },
    ],
    [museoId]
  );

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: resenas,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="tabla-main">
        <h1>
          {museoId
            ? `Reseñas no aprobadas de ${museoId}`
            : `Reseñas no aprobadas`}
        </h1>
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
    </motion.div>
  );
}

export default ModHistory;
