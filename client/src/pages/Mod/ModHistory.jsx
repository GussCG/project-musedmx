import { useState, useEffect, useMemo } from "react";
import Icons from "../../components/Other/IconProvider";
const { LuArrowUpDown, LuEye, IoIosArrowBack, IoIosArrowForward } = Icons;
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useResenaMods } from "../../hooks/Resena/useResenaMods";
import { useMuseo } from "../../hooks/Museo/useMuseo";
import ReactPaginate from "react-paginate";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { formatearFecha } from "../../utils/formatearFechas";

function ModHistory() {
  // Obtener el museoId de la URL
  const { museoId } = useParams();
  const [museoNombre, setMuseoNombre] = useState("");
  const [resenas, setResenas] = useState([]);

  const { fetchAllResenas, fetchAllResenasByMuseo } = useResenaMods();
  const { fetchMuseo } = useMuseo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedResenas;
        if (museoId) {
          fetchedResenas = await fetchAllResenasByMuseo(museoId);
          const response = await fetchMuseo(museoId);
          setMuseoNombre(response.nombre || "Museo Desconocido");
        } else {
          fetchedResenas = await fetchAllResenas();
        }
        setResenas(
          fetchedResenas.resenas.sort((a, b) => a.res_aprobado - b.res_aprobado)
        );
      } catch (error) {
        console.error("Error fetching reseñas:", error);
      }
    };
    fetchData();
  }, [museoId]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "visitas_vi_usr_correo",
        header: "Usuario",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "visitas_vi_fechahora",
        header: "Fecha de Reseña",
        cell: (info) => formatearFecha(info.getValue()),
        enableSorting: true,
      },
      ...(museoId
        ? []
        : [
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
          ]),
      {
        accessorKey: "res_calif_estrellas",
        header: "Calificación",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: "res_aprobado",
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
          <Link to={`/Mod/Resena/${row.original.res_id_res}`}>
            <LuEye />
          </Link>
        ),
        enableSorting: false,
      },
    ],
    [museoId]
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const table = useReactTable({
    data: resenas,
    columns,
    state: { sorting, pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ← usa este
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  const pageCount = Math.ceil(resenas.length / pagination.pageSize);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="tabla-main">
        <div className="tabla-header">
          <h1>
            {museoId
              ? `Reseñas no aprobadas de ${museoNombre}`
              : `Reseñas no aprobadas`}
          </h1>
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

export default ModHistory;
