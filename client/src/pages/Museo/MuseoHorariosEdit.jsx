import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useMuseoHorario from "../../hooks/Museo/useMuseoHorarios";
import { motion } from "framer-motion";
import AddDia from "../../components/Museo/AddDia";
import PopupPortal from "../../components/Other/PopupPortal";
import Icons from "../../components/Other/IconProvider";
import ToastMessage from "../../components/Other/ToastMessage";
const { MdDelete } = Icons;

function MuseoHorariosEdit() {
  const { museoId } = useParams();
  const {
    horarios,
    loading: loadingHorarios,
    error: errorHorarios,
    fetchHorarios,
    setHorarios,
    updateHorarioByDia,
    deleteHorarioByDia,
  } = useMuseoHorario(museoId);
  const [originalHorarios, setOriginalHorarios] = useState(horarios);

  const [showAgregarPop, setShowAgregarPop] = useState(false);

  const [editingRow, setEditingRow] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const [tempEditData, setTempEditData] = useState(null);

  const handleEdit = (rowIndex) => {
    setOriginalHorarios([...horarios]);
    setEditingRow(rowIndex);

    const rowData = horarios[rowIndex] || {};
    setTempEditData({
      mh_dia: rowData.mh_dia || "",
      mh_hora_inicio: rowData.mh_hora_inicio || "",
      mh_hora_fin: rowData.mh_hora_fin || "",
      mh_precio_ad: rowData.mh_precio_ad || "",
      mh_precio_ni: rowData.mh_precio_ni || "",
      mh_precio_est: rowData.mh_precio_est || "",
      mh_precio_ter: rowData.mh_precio_ter || "",
    });

    setFocusedField(null);
  };

  const handleCancel = () => {
    setHorarios(originalHorarios);
    setEditingRow(null);
  };

  const handleChange = (field, value) => {
    setTempEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (rowIndex) => {
    if (!tempEditData.mh_hora_inicio || !tempEditData.mh_hora_fin) {
      ToastMessage({
        tipo: "error",
        mensaje: "Por favor, completa todos los campos",
        position: "top-right",
      });
      return;
    }

    if (tempEditData.mh_hora_inicio >= tempEditData.mh_hora_fin) {
      ToastMessage({
        tipo: "error",
        mensaje: "La hora de inicio debe ser menor que la hora de cierre",
        position: "top-right",
      });
      return;
    }

    const updated = [...horarios];
    updated[rowIndex] = { ...tempEditData };
    setHorarios(updated);
    setEditingRow(null);
    setTempEditData(null);

    updateHorarioByDia(updated[rowIndex].mh_dia, updated[rowIndex]);

    ToastMessage({
      tipo: "success",
      mensaje: `Horario de ${updated[rowIndex].mh_dia} actualizado correctamente`,
      position: "top-right",
    });
  };

  const handleDelete = async (rowIndex) => {
    const dia = horarios[rowIndex].mh_dia;
    const response = await deleteHorarioByDia(dia, museoId);

    if (response.success) {
      ToastMessage({
        tipo: "success",
        mensaje: `Horario de ${dia} eliminado correctamente`,
        position: "top-right",
      });
      fetchHorarios(museoId);
    } else {
      ToastMessage({
        tipo: "error",
        mensaje: `Error al eliminar día`,
        position: "top-right",
      });
    }
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
        accessorKey: "mh_hora_inicio",
        header: "Hora de Inicio",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              key={`hora_fin-${rowIndex}`}
              type="time"
              step={1}
              min="00:00"
              value={tempEditData?.mh_hora_inicio ?? ""}
              onChange={(e) => {
                handleChange("mh_hora_inicio", e.target.value);
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
              key={`hora_fin-${rowIndex}`}
              type="time"
              step={1}
              min="00:00"
              value={tempEditData?.mh_hora_fin ?? ""}
              onChange={(e) => {
                handleChange("mh_hora_fin", e.target.value);
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
        accessorKey: "mh_precio_ad",
        header: "Costo de Adulto",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              key={`precio-ad-${rowIndex}`}
              type="number"
              value={tempEditData?.mh_precio_ad ?? ""}
              onChange={(e) => {
                handleChange("mh_precio_ad", e.target.value);
              }}
              onFocus={() => setFocusedField(`${rowIndex}-precio-ad`)}
              autoFocus={focusedField === `${rowIndex}-precio-ad`}
              min={0}
            />
          ) : (
            `$ ${info.getValue()}`
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mh_precio_ni",
        header: "Costo de Niños",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              key={`precio-ni-${rowIndex}`}
              type="number"
              value={tempEditData?.mh_precio_ni ?? ""}
              onChange={(e) => {
                handleChange("mh_precio_ni", e.target.value);
              }}
              onFocus={() => setFocusedField(`${rowIndex}-precio-ni`)}
              autoFocus={focusedField === `${rowIndex}-precio-ni`}
              min={0}
            />
          ) : (
            `$ ${info.getValue()}`
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mh_precio_est",
        header: "Costo de Estudiante",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              key={`precio-est-${rowIndex}`}
              type="number"
              value={tempEditData?.mh_precio_est ?? ""}
              onChange={(e) => {
                handleChange("mh_precio_est", e.target.value);
              }}
              onFocus={() => setFocusedField(`${rowIndex}-precio-est`)}
              autoFocus={focusedField === `${rowIndex}-precio-est`}
              min={0}
            />
          ) : (
            `$ ${info.getValue()}`
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mh_precio_ter",
        header: "Costo de Tercera Edad",
        cell: (info) => {
          const rowIndex = info.row.index;
          return editingRow === rowIndex ? (
            <input
              key={`precio-ter-${rowIndex}`}
              type="number"
              value={tempEditData?.mh_precio_ter ?? ""}
              onChange={(e) => {
                handleChange("mh_precio_ter", e.target.value);
              }}
              onFocus={() => setFocusedField(`${rowIndex}-precio-ter`)}
              autoFocus={focusedField === `${rowIndex}-precio-ter`}
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
              <button
                onClick={() => {
                  handleSave(info.row.index);
                  setEditingRow(null);
                }}
              >
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
      {
        accessorKey: "eliminar",
        header: "Eliminar",
        cell: (info) => (
          <button
            onClick={() => {
              handleDelete(info.row.index);
              setEditingRow(null);
            }}
          >
            <MdDelete />
          </button>
        ),
      },
    ],
    [editingRow, focusedField, horarios, tempEditData]
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
          <button className="button" onClick={() => setShowAgregarPop(true)}>
            Agregar Días
          </button>
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

      {showAgregarPop && (
        <PopupPortal>
          <AddDia
            onClose={() => setShowAgregarPop(false)}
            horario={horarios}
            onAdded={() => {
              fetchHorarios(museoId);
              setShowAgregarPop(false);
            }}
          />
        </PopupPortal>
      )}
    </motion.div>
  );
}

export default MuseoHorariosEdit;
