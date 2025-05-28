import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Icons from "../../components/Other/IconProvider";
const { LuArrowUpDown, FaUserEdit, MdDelete } = Icons;
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import useModeradores from "../../hooks/Usuario/useModeradores";
import ToastMessage from "../../components/Other/ToastMessage";

function ModList() {
  const { fetchModeradores, loading, eliminarModerador, error } =
    useModeradores();
  const [moderadores, setModeradores] = useState([]);

  useEffect(() => {
    const obtenerModeradores = async () => {
      try {
        const data = await fetchModeradores();
        setModeradores(data);
      } catch (error) {
        console.error("Error al obtener moderadores:", error);
      }
    };
    obtenerModeradores();
  }, []);

  const handleEliminar = async (mod) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al moderador ${mod.usr_nombre} ${mod.usr_ap_paterno}?`
    );
    if (!confirmDelete) return;

    try {
      const response = await eliminarModerador(mod);
      if (response && response.status === 200) {
        ToastMessage({
          tipo: "success",
          mensaje: "Moderador eliminado correctamente",
          position: "top-right",
        });
        setModeradores((prev) =>
          prev.filter((moderador) => moderador.usr_correo !== mod.usr_correo)
        );
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al eliminar moderador:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al eliminar moderador",
        position: "top-right",
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "usr_correo",
        header: "Correo",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "usr_nombre",
        header: "Nombre",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "usr_ap_paterno",
        header: "Apellido Paterno",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "usr_ap_materno",
        header: "Apellido Materno",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "usr_telefono",
        header: "Teléfono",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        id: "editar",
        header: "Editar",
        cell: (info) => (
          <Link to={`/Admin/VerMods/Editar/${info.row.original.usr_correo}`}>
            <FaUserEdit />
          </Link>
        ),
        enableSorting: false,
      },
      {
        id: "eliminar",
        header: "Borrar",
        cell: (info) => (
          <button onClick={() => handleEliminar(info.row.original)}>
            <MdDelete />
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.div>
  );
}

export default ModList;
