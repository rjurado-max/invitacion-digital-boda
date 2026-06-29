"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  bulkUpdateGuestTable,
  createWeddingTable,
  deleteWeddingTable,
  getAdminTables,
  moveTableOrder,
  toggleTablesLocked,
  toggleWeddingTableStatus,
  updateGuestTable,
  updateWeddingTable,
} from "@/actions/admin-table-actions";

type Guest = {
  id: string;
  full_name: string;
  phone: string | null;
  table_number: string | null;
  attendance: string;
  invitation_group?: string | null;
};

type WeddingTable = {
  id: string;
  name: string;
  capacity: number;
  sort_order: number;
  is_active: boolean;
};

type AdminTableData = {
  guests: Guest[];
  tables: WeddingTable[];
  tablesLocked: boolean;
};

export default function AdminTablesManager({
  initialAdminCode = "",
}: {
  initialAdminCode?: string;
}) {
  const [adminCode] = useState(initialAdminCode);
  const [data, setData] = useState<AdminTableData | null>(null);
  const [search, setSearch] = useState("");
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [bulkTableNumber, setBulkTableNumber] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("10");
  const [editingTableId, setEditingTableId] = useState("");
  const [editingTableName, setEditingTableName] = useState("");
  const [editingTableCapacity, setEditingTableCapacity] = useState("8");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const response = await getAdminTables(adminCode);

      setMessage(response.message);

      if (response.data) {
        setData(response.data);
      }
    });
  };

  useEffect(() => {
    if (!adminCode) return;

    loadData();
  }, [adminCode]);

  const guests = data?.guests ?? [];
  const tables = data?.tables ?? [];
  const tablesLocked = data?.tablesLocked ?? false;

  const confirmLockedChange = () => {
    if (!tablesLocked) return true;

    return confirm(
        "La distribución de mesas está finalizada. ¿Deseas modificarla de todos modos?"
    );
    };

  const filteredGuests = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return guests;

    return guests.filter((guest) =>
      `${guest.full_name} ${guest.table_number ?? ""} ${
        guest.invitation_group ?? ""
      }`
        .toLowerCase()
        .includes(value)
    );
  }, [guests, search]);

  const pendingGuests = guests.filter((guest) => !guest.table_number).length;

  const tableStats = useMemo(() => {
    return tables.map((table) => {
        const assignedGuestsList = guests.filter(
        (guest) => guest.table_number === table.name
        );

        const assignedGuests = assignedGuestsList.length;

        return {
        ...table,
        assignedGuests,
        assignedGuestsList,
        availableSeats: table.capacity - assignedGuests,
        };
    });
    }, [guests, tables]);

  const assignTable = (guestId: string, tableNumber: string) => {
    if (!confirmLockedChange()) return;

    startTransition(async () => {
      const response = await updateGuestTable({
        adminCode,
        guestId,
        tableNumber,
      });

      setMessage(response.message);

      if (response.success) {
        loadData();
      }
    });
  };

  const assignSelectedGuests = () => {
    if (!confirmLockedChange()) return;

    startTransition(async () => {
        const response = await bulkUpdateGuestTable({
        adminCode,
        guestIds: selectedGuestIds,
        tableNumber: bulkTableNumber,
        });

        setMessage(response.message);

        if (response.success) {
        setSelectedGuestIds([]);
        setBulkTableNumber("");
        loadData();
        }
    });
    };

    const handleToggleTablesLocked = () => {
        startTransition(async () => {
            const response = await toggleTablesLocked({
            adminCode,
            currentValue: tablesLocked,
            });

            setMessage(response.message);

            if (response.success) {
            loadData();
            }
        });
        };

    const exportTablePlan = () => {
        const separator = ";";

        const normalizeValue = (value: string) =>
            `"${String(value ?? "")
            .replaceAll('"', '""')
            .replaceAll("\n", " ")
            .replaceAll("\r", " ")}"`;

        const rows: string[][] = [];

        tableStats.forEach((table) => {
            rows.push([table.name, "", ""]);
            rows.push(["Invitado", "Celular", "Grupo"]);

            if (table.assignedGuestsList.length === 0) {
            rows.push(["Sin invitados asignados", "", ""]);
            } else {
            table.assignedGuestsList.forEach((guest) => {
                rows.push([
                guest.full_name,
                guest.phone || "",
                guest.invitation_group || "",
                ]);
            });
            }

            rows.push(["", "", ""]);
        });

        const csvContent = rows
            .map((row) => row.map(normalizeValue).join(separator))
            .join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "plano-de-mesas.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        };

  const addTable = () => {
    if (!confirmLockedChange()) return;

    startTransition(async () => {
        const response = await createWeddingTable({
        adminCode,
        name: newTableName,
        capacity: newTableCapacity,
        });

        setMessage(response.message);

        if (response.success) {
        setNewTableName("");
        setNewTableCapacity("10");
        loadData();
        }
    });
    };

    const startEditTable = (table: WeddingTable) => {
        setEditingTableId(table.id);
        setEditingTableName(table.name);
        setEditingTableCapacity(String(table.capacity));
        };

        const cancelEditTable = () => {
        setEditingTableId("");
        setEditingTableName("");
        setEditingTableCapacity("8");
        };

        const saveTableEdit = () => {
            if (!confirmLockedChange()) return;

            startTransition(async () => {
                const response = await updateWeddingTable({
                adminCode,
                tableId: editingTableId,
                name: editingTableName,
                capacity: editingTableCapacity,
                });

                setMessage(response.message);

                if (response.success) {
                cancelEditTable();
                loadData();
                }
            });
        };

        const changeTableStatus = (table: WeddingTable) => {
            if (!confirmLockedChange()) return;

            startTransition(async () => {
                const response = await toggleWeddingTableStatus({
                adminCode,
                tableId: table.id,
                isActive: table.is_active,
                });

                setMessage(response.message);

                if (response.success) {
                loadData();
                }
            });
            };

        const removeTable = (table: WeddingTable) => {
            if (!confirmLockedChange()) return;

            const confirmed = confirm(
                `¿Deseas eliminar la mesa "${table.name}"? Esta acción no se puede deshacer.`
            );

            if (!confirmed) return;

            startTransition(async () => {
                const response = await deleteWeddingTable({
                adminCode,
                tableId: table.id,
                });

                setMessage(response.message);

                if (response.success) {
                loadData();
                }
            });
            };

            const moveTable = (table: WeddingTable, direction: "up" | "down") => {
                if (!confirmLockedChange()) return;
                
                startTransition(async () => {
                    const response = await moveTableOrder({
                    adminCode,
                    tableId: table.id,
                    direction,
                    });

                    setMessage(response.message);

                    if (response.success) {
                    loadData();
                    }
                });
                };

  return (
    <div className="bg-[#f7f1e8] text-[#211b17]">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-5xl">Administrar mesas</h1>

        <p className="mt-4 text-lg text-neutral-600">
          Organiza a los invitados, asigna mesas y revisa quiénes aún están
          pendientes.
        </p>

        {tablesLocked && (
            <div className="mt-4 rounded-2xl border border-green-300 bg-green-50 p-4 text-green-800">
                ✓ La distribución de mesas está finalizada. Los cambios se encuentran bloqueados.
            </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <SummaryCard title="Invitados activos" value={guests.length} />
          <SummaryCard title="Sin mesa" value={pendingGuests} />
          <SummaryCard
            title="Mesas activas"
            value={tables.filter((table) => table.is_active).length}
            />
        </div>

        <div className="mt-6">
            <button
                type="button"
                onClick={handleToggleTablesLocked}
                disabled={isPending}
                className={`rounded-full px-6 py-3 text-xs font-black tracking-[0.15em] text-white ${
                tablesLocked
                    ? "bg-green-700"
                    : "bg-[#9d7c43]"
                }`}
            >
                {tablesLocked
                ? "✓ DISTRIBUCIÓN FINALIZADA"
                : "FINALIZAR DISTRIBUCIÓN"}
            </button>
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-3xl">Crear mesa</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_160px]">
                <input
                value={newTableName}
                onChange={(event) => setNewTableName(event.target.value)}
                placeholder="Nombre de la mesa"
                className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <input
                value={newTableCapacity}
                onChange={(event) => setNewTableCapacity(event.target.value)}
                placeholder="Capacidad"
                type="number"
                min="1"
                className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none"
                />

                <button
                type="button"
                onClick={addTable}
                disabled={isPending}
                className="rounded-full bg-black px-6 py-4 text-sm font-black tracking-[0.2em] text-white disabled:opacity-60"
                >
                CREAR
                </button>
            </div>
            </section>
        
        <section className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-3xl">Resumen por mesa</h2>

            <button
                type="button"
                onClick={exportTablePlan}
                className="rounded-full bg-black px-5 py-3 text-xs font-black tracking-[0.15em] text-white"
            >
                EXPORTAR PLANO
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {tableStats.map((table) => (
              <div
                key={table.id}
                className="rounded-2xl border border-[#eadfce] bg-[#fbf6ed] p-4"
              >
                {editingTableId === table.id ? (
                    <div className="space-y-3">
                        <input
                        value={editingTableName}
                        onChange={(event) => setEditingTableName(event.target.value)}
                        className="w-full rounded-xl border border-[#eadfce] px-3 py-2 outline-none"
                        />

                        <input
                        value={editingTableCapacity}
                        onChange={(event) => setEditingTableCapacity(event.target.value)}
                        type="number"
                        min="1"
                        className="w-full rounded-xl border border-[#eadfce] px-3 py-2 outline-none"
                        />

                        <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={saveTableEdit}
                            disabled={isPending}
                            className="rounded-full bg-black px-4 py-2 text-xs font-black tracking-[0.15em] text-white disabled:opacity-60"
                        >
                            GUARDAR
                        </button>

                        <button
                            type="button"
                            onClick={cancelEditTable}
                            className="rounded-full border border-[#eadfce] px-4 py-2 text-xs font-black tracking-[0.15em] text-[#9d7c43]"
                        >
                            CANCELAR
                        </button>
                        </div>
                    </div>
                    ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-[1fr_120px] sm:items-center">
                            <div>
                                <p className="font-bold text-[#9d7c43]">{table.name}</p>

                                <p className="mt-1 text-sm text-neutral-600">
                                {table.assignedGuests} de {table.capacity} asiento(s)
                                </p>

                                <p
                                className={`mt-1 text-sm font-semibold ${
                                    table.availableSeats < 0 ? "text-red-600" : "text-green-700"
                                }`}
                                >
                                {table.availableSeats < 0
                                    ? `Excede por ${Math.abs(table.availableSeats)} invitado(s)`
                                    : `${table.availableSeats} asiento(s) disponible(s)`}
                                </p>

                                <div className="mt-3">
                                    <div className="mb-2 flex items-center justify-between text-xs text-neutral-600">
                                        <span>
                                        Ocupación
                                        </span>

                                        <span className="font-semibold">
                                        {table.assignedGuests} / {table.capacity}
                                        </span>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-[#eadfce]">
                                        <div
                                        className={`h-full rounded-full ${
                                            table.assignedGuests > table.capacity
                                            ? "bg-red-600"
                                            : table.assignedGuests === table.capacity
                                                ? "bg-[#9d7c43]"
                                                : "bg-green-700"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                            100,
                                            Math.round((table.assignedGuests / table.capacity) * 100)
                                            )}%`,
                                        }}
                                        />
                                    </div>
                                    </div>

                                <div className="mt-3 rounded-xl bg-white/70 p-3">
                                    <p className="text-xs font-black tracking-[0.18em] text-[#9d7c43]">
                                        INVITADOS ({table.assignedGuests})
                                    </p>

                                    {table.assignedGuestsList.length === 0 ? (
                                        <p className="mt-2 text-sm text-neutral-500">Sin invitados asignados.</p>
                                    ) : (
                                        <ul className="mt-2 space-y-2">
                                        {table.assignedGuestsList.map((guest) => (
                                            <li
                                                key={guest.id}
                                                className="flex items-start gap-2 text-sm text-neutral-700"
                                                >
                                                <span className="mt-[2px] text-[#9d7c43]">•</span>

                                                <span className="break-words leading-relaxed">
                                                    {guest.full_name}
                                                </span>
                                                </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>
                            </div>

                            <div className="flex flex-col gap-2">
                            
                              <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveTable(table, "up")}
                                    className="rounded-full border border-[#eadfce] px-4 py-2 text-xs font-black text-[#9d7c43]"
                                >
                                    ↑
                                </button>

                                <button
                                    type="button"
                                    onClick={() => moveTable(table, "down")}
                                    className="rounded-full border border-[#eadfce] px-4 py-2 text-xs font-black text-[#9d7c43]"
                                >
                                    ↓
                                </button>
                                </div>

                                <button
                                type="button"
                                onClick={() => startEditTable(table)}
                                className="rounded-full bg-black px-4 py-2 text-xs font-black tracking-[0.15em] text-white"
                                >
                                EDITAR
                                </button>

                                <button
                                type="button"
                                onClick={() => changeTableStatus(table)}
                                className={`rounded-full px-4 py-2 text-xs font-black tracking-[0.15em] text-white ${
                                    table.is_active ? "bg-red-600" : "bg-green-700"
                                }`}
                                >
                                {table.is_active ? "DESACTIVAR" : "ACTIVAR"}
                                </button>

                                <button
                                type="button"
                                onClick={() => removeTable(table)}
                                className="rounded-full bg-[#7f1d1d] px-4 py-2 text-xs font-black tracking-[0.15em] text-white"
                                >
                                ELIMINAR
                                </button>
                            </div>
                        </div>
                    </>
                    )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-3xl">Invitados</h2>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <select
                    value={bulkTableNumber}
                    onChange={(event) => setBulkTableNumber(event.target.value)}
                    className="rounded-2xl border border-[#eadfce] px-4 py-3 outline-none"
                >
                    <option value="">Asignar seleccionados a...</option>

                    {tables
                    .filter((table) => table.is_active)
                    .map((table) => (
                        <option key={table.id} value={table.name}>
                        {table.name}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={assignSelectedGuests}
                    disabled={isPending || selectedGuestIds.length === 0}
                    className="rounded-full bg-[#9d7c43] px-5 py-3 text-xs font-black tracking-[0.15em] text-white disabled:opacity-50"
                >
                    ASIGNAR SELECCIONADOS
                </button>
                </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, mesa o grupo..."
              className="w-full rounded-2xl border border-[#eadfce] px-5 py-4 outline-none md:max-w-md"
            />
          </div>

          <div className="mt-6 max-h-[720px] space-y-4 overflow-y-auto pr-3">
            {filteredGuests.length === 0 ? (
              <p className="text-neutral-500">No hay invitados para mostrar.</p>
            ) : (
              filteredGuests.map((guest) => (
                <article
                  key={guest.id}
                  className="rounded-2xl border border-[#eadfce] p-4"
                >
                  <div className="grid gap-4 md:grid-cols-[1fr_320px] md:items-center">
                    <div>
                        <label className="mb-2 flex items-center gap-3">
                            <input
                            type="checkbox"
                            checked={selectedGuestIds.includes(guest.id)}
                            onChange={(event) => {
                                if (event.target.checked) {
                                setSelectedGuestIds([...selectedGuestIds, guest.id]);
                                } else {
                                setSelectedGuestIds(
                                    selectedGuestIds.filter((id) => id !== guest.id)
                                );
                                }
                            }}
                            className="h-4 w-4 accent-[#9d7c43]"
                            />

                            <h3 className="font-serif text-2xl">
                            {guest.full_name}
                            </h3>
                        </label>

                      <p className="mt-1 text-sm text-neutral-600">
                        Celular: {guest.phone || "-"}
                      </p>

                      <p className="mt-1 text-sm text-neutral-600">
                        Grupo: {guest.invitation_group || "-"}
                      </p>

                      <p className="mt-2 text-sm">
                        Mesa actual:{" "}
                        <strong>
                          {guest.table_number || "Pendiente de asignar"}
                        </strong>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <select
                        defaultValue={guest.table_number ?? ""}
                        className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 outline-none"
                      >
                        <option value="">Sin mesa</option>

                        {tables
                            .filter((table) => table.is_active)
                            .map((table) => (
                                <option key={table.id} value={table.name}>
                                {table.name}
                                </option>
                            ))}
                      </select>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={(event) => {
                          const select =
                            event.currentTarget
                              .previousElementSibling as HTMLSelectElement;

                          assignTable(guest.id, select.value);
                        }}
                        className="rounded-full bg-black px-5 py-3 text-xs font-black tracking-[0.15em] text-white disabled:opacity-60"
                      >
                        GUARDAR
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-[#fbf6ed] p-4 text-center text-neutral-700">
              {message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
      <p className="font-serif text-4xl">{value}</p>
      <p className="mt-2 text-xs font-black tracking-[0.25em] text-[#9d7c43]">
        {title.toUpperCase()}
      </p>
    </div>
  );
}