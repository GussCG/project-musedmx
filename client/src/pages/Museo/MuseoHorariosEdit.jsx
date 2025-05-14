import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useMuseoHorario from "../../hooks/Museo/useMuseoHorarios";

import { motion } from "framer-motion";

function MuseoHorariosEdit() {
  const { museoId } = useParams();
  const {
    horarios,
    loading: loadingHorarios,
    error: errorHorarios,
    fetchHorarios,
    setHorarios,
  } = useMuseoHorario(museoId);
  const [originalHorarios, setOriginalHorarios] = useState(horarios);

  const [editingRow, setEditingRow] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleEdit = (rowIndex) => {
    setOriginalHorarios([...horarios]);
    setEditingRow(rowIndex);
    setFocusedField(null);
  };

  const handleSave = (rowIndex) => {
    setEditingRow(null);
    // Aquí puedes agregar la lógica para guardar los cambios en el horario
    console.log("Guardando cambios en el horario:", horarios[rowIndex]);
  };

  const handleCancel = () => {
    setHorarios(originalHorarios);
    setEditingRow(null);
  };

  const handleChange = (rowIndex, field, value) => {
    setHorarios((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "mh_dia",
        header: "Día",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        accessorKey: "mh_hora_fin",
        header: "Hora de Cierre",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              type="time"
              value={horarios[rowIndex].mh_hora_fin}
              onChange={(e) => {
                const newValue = e.target.value;
                setHorarios((prev) =>
                  prev.map((row, idx) =>
                    idx === rowIndex ? { ...row, mh_hora_fin: newValue } : row
                  )
                );
              }}
              onFocus={() => setFocusedField(`${rowIndex}-hora_fin`)}
              autoFocus={focusedField === `${rowIndex}-hora_fin`}
            />
          ) : (
            info.getValue()
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mh_hora_fin",
        header: "Hora de Cierre",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              type="time"
              value={horarios[rowIndex].mh_hora_fin}
              onChange={(e) => {
                const newValue = e.target.value;
                setHorarios((prev) =>
                  prev.map((row, idx) =>
                    idx === rowIndex ? { ...row, mh_hora_fin: newValue } : row
                  )
                );
              }}
              onFocus={(e) => e.target.select()}
            />
          ) : (
            info.getValue()
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mh_precio_dia",
        header: "Costo de Entrada (MXN)",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              type="number"
              value={horarios[rowIndex].mh_precio_dia}
              onChange={(e) => {
                const newValue = e.target.value;
                setHorarios((prev) =>
                  prev.map((row, idx) =>
                    idx === rowIndex ? { ...row, mh_precio_dia: newValue } : row
                  )
                );
              }}
              onFocus={() => setFocusedField(`${rowIndex}-precio`)}
              autoFocus={focusedField === `${rowIndex}-precio`}
              min={0}
            />
          ) : (
            `$ ${info.getValue()}`
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "editar",
        header: "Acciones",
        cell: (info) =>
          editingRow === info.row.index ? (
            <div className="action-buttons">
              <button onClick={() => handleSave(info.row.index)}>
                Guardar
              </button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          ) : (
            <div className="action-buttons">
              <button onClick={() => handleEdit(info.row.index)}>Editar</button>
            </div>
          ),
        enableSorting: false,
      },
    ],
    [editingRow, focusedField, horarios]
  );

  const table = useReactTable({
    data: horarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      key={"museo-horarios-edit"}
    >
      <main id="tabla-main">
        <div className="tabla-header">
          <h1>Editar Horarios</h1>
        </div>
        <motion.div
          className="tabla-container"
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          key={"museo-horarios-edit-table"}
          transition={{ duration: 0.5, type: "tween", ease: "easeInOut" }}
        >
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
        </motion.div>
      </main>
    </motion.div>
  );
}

export default MuseoHorariosEdit;
