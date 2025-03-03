import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import Icons from "../../components/IconProvider";
const { LuArrowUpDown, editarModIcon, eliminarIcon } = Icons;

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModList() {
  const [moderadores, setModeradores] = useState([]);

  const moderadoresPrueba = [
    {
      id: 1,
      nombre: "Juan",
      apPaterno: "Perez",
      apMaterno: "Gonzalez",
      email: "mail1@mod.com",
      tipoUsuario: 3,
      fecNac: "2002-09-30",
      tel: "5527167255",
      foto: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png",
    },
    {
      id: 2,
      nombre: "Pedro",
      apPaterno: "Perez",
      apMaterno: "Gonzalez",
      email: "mail2@mod.com",
      tipoUsuario: 3,
      fecNac: "2002-09-30",
      tel: "5527167255",
      foto: "https://a.espncdn.com/i/headshots/nba/players/full/3974.png",
    },
  ];

  useEffect(() => {
    setModeradores(moderadoresPrueba);
  }, []);

  const eliminarMod = (id) => {
    // Logicar para eliminar un moderador
    toast.success(`Moderador Eliminado`, {
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

  const columns = useMemo(
    () => [
      //   {
      //     accessorKey: "foto",
      //     header: "Foto",
      //     cell: (info) => (
      //       <img
      //         src={info.getValue()}
      //         alt="Foto de perfil"
      //         style={{
      //           width: "100px",
      //           height: "100px",
      //           borderRadius: "50%",
      //           objectFit: "cover",
      //           backgroundColor: "white",
      //           border: "2px solid black",
      //         }}
      //       />
      //     ),
      //     enableSorting: false,
      //   },
      {
        accessorKey: "email",
        header: "Correo",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "apPaterno",
        header: "Apellido Paterno",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "apMaterno",
        header: "Apellido Materno",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "tel",
        header: "Teléfono",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        id: "editar",
        header: "Editar",
        cell: (info) => (
          <Link to={`/Admin/VerMods/Editar/${info.row.original.id}`}>
            <img src={editarModIcon} alt="Ver" />
          </Link>
        ),
        enableSorting: false,
      },
      {
        id: "eliminar",
        header: "Borrar",
        cell: (info) => (
          <button onClick={() => eliminarMod(info.row.original.id)}>
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
    data: moderadores,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <main id="tabla-main">
        <div className="tabla-header">
          <h1>Moderadores</h1>
          <Link className="button-link" to="/Admin/Agregar">
            Registrar Moderador
          </Link>
        </div>
        <div className="tabla-container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ display: "flex", alignItems: "center" }}
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
    </>
  );
}

export default ModList;
