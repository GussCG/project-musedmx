import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { LuArrowUpDown, LuEye, FaTrash, IoIosArrowBack, IoIosArrowForward } =
  Icons;
import ToastMessage from "../../components/Other/ToastMessage";
import { formatearFecha } from "../../utils/formatearFechas";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import useResenaUsuario from "../../hooks/Resena/useResenaUsuario";
import ReactPaginate from "react-paginate";

function ProfileHistory() {
  const [visitas, setVisitas] = useState([]);
  const { fetchResenasByCorreo, eliminarResena } = useResenaUsuario();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const response = await fetchResenasByCorreo(user.usr_correo);
        if (response) {
          setVisitas(response);
        } else {
          ToastMessage({
            type: "error",
            message: "Error al cargar las reseñas",
            duration: 2000,
          });
        }
      }
    };
    fetchData();
  }, [user]);

  // Funcion para eliminar una visita del historial
  const handleEliminar = (resenaId) => {
    const eliminarVisita = async () => {
      try {
        const response = await eliminarResena(resenaId);
        if (response) {
          ToastMessage({
            tipo: "success",
            mensaje: "Reseña eliminada correctamente",
            position: "top-right",
          });
          // Actualizar el estado de visitas después de eliminar
          setVisitas((prevVisitas) =>
            prevVisitas.filter((visita) => visita.res_id_res !== resenaId)
          );
        } else {
          ToastMessage({
            tipo: "error",
            mensaje: "Error al eliminar la reseña",
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error al eliminar la visita:", error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al eliminar la reseña",
          position: "top-right",
        });
      }
    };
    eliminarVisita();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "visitas_vi_fechahora",
        header: "Fecha de la visita",
        cell: (info) => formatearFecha(info.getValue()),
        enableSorting: true,
      },
      {
        accessorKey: "mus_nombre",
        header: "Museo",
        cell: ({ row }) => (
          <Link to={`/Museos/${row.original.visitas_vi_mus_id}`}>
            {row.original.mus_nombre}
          </Link>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "res_calif_estrellas",
        header: "Calificación",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "res_aprobado",
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
          <Link to={`./${info.row.original.res_id_res}`}>
            <LuEye />
          </Link>
        ),
        enableSorting: false,
      },
      {
        id: "eliminar",
        header: "Borrar",
        cell: (info) => (
          <button onClick={() => handleEliminar(info.row.original.res_id_res)}>
            <FaTrash />
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const table = useReactTable({
    data: visitas,
    columns,
    state: { sorting, pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ← usa este
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  const pageCount = Math.ceil(
    visitas.length / table.getState().pagination.pageSize
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="tabla-main">
        <div className="tabla-header">
          <h1>Mis Reseñas</h1>
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
              {table.getPaginationRowModel().rows.map((row) => (
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

        {pageCount > 0 && (
          <ReactPaginate
            breakLabel="..."
            breakClassName="break"
            nextLabel={<IoIosArrowForward />}
            onPageChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: e.selected,
              }))
            }
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            previousLabel={<IoIosArrowBack />}
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="previous"
            previousLinkClassName="previous"
            nextClassName="next"
            nextLinkClassName="next"
            breakLinkClassName="page-link"
            activeClassName="active"
            forcePage={pagination.pageIndex}
          />
        )}
      </main>
    </motion.div>
  );
}

export default ProfileHistory;
