import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

import { motion } from "framer-motion";

function MuseoHorariosEdit() {
  const horarioPrueba = [
    {
      dia: "Lunes",
      horaAper: "10:00",
      horaCierre: "18:00",
      costo: "50",
      edit: false,
    },
    {
      dia: "Martes",
      horaAper: "10:00",
      horaCierre: "18:00",
      costo: "50",
      edit: false,
    },
    {
      dia: "Miércoles",
      horaAper: "10:00",
      horaCierre: "18:00",
      costo: "50",
      edit: false,
    },
  ];

  const [horarios, setHorarios] = useState(horarioPrueba);
  const [editingRow, setEditingRow] = useState(null);

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  const handleSave = (rowIndex) => {
    setEditingRow(null);
    // Aquí puedes agregar la lógica para guardar los cambios en el horario
    console.log("Guardando cambios en el horario:", horarios[rowIndex]);
  };

  const handleCancel = () => {
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
        accessorKey: "dia",
        header: "Día",
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
      {
        accessorKey: "horaAper",
        header: "Hora de Apertura",
        cell: (info) =>
          editingRow === info.row.index ? (
            <input
              type="time"
              value={info.row.original.horaAper}
              onChange={(e) =>
                handleChange(info.row.index, "horaAper", e.target.value)
              }
            />
          ) : (
            info.getValue()
          ),
        enableSorting: false,
      },
      {
        accessorKey: "horaCierre",
        header: "Hora de Cierre",
        cell: (info) =>
          editingRow === info.row.index ? (
            <input
              type="time"
              value={info.row.original.horaCierre}
              onChange={(e) =>
                handleChange(info.row.index, "horaCierre", e.target.value)
              }
            />
          ) : (
            info.getValue()
          ),
        enableSorting: false,
      },
      {
        accessorKey: "costo",
        header: "Costo de Entrada (MXN)",
        cell: (info) =>
          editingRow === info.row.index ? (
            <input
              type="number"
              value={info.row.original.costo}
              onChange={(e) =>
                handleChange(info.row.index, "costo", e.target.value)
              }
              min={0}
            />
          ) : (
            `$ ${info.getValue()}`
          ),
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
    [editingRow]
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
