"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function validateAdminCode(adminCode: string) {
  const configuredCode = process.env.ADMIN_ACCESS_CODE;

  if (!configuredCode) return false;

  return adminCode.trim() === configuredCode;
}

export async function getAdminTables(adminCode: string) {
  if (!validateAdminCode(adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
      data: null,
    };
  }

  const { data: guests, error: guestsError } = await supabase
    .from("rsvps")
    .select("id, full_name, phone, table_number, attendance")
    .eq("attendance", "SI")
    .order("created_at", { ascending: false });

  const { data: tables, error: tablesError } = await supabase
    .from("wedding_tables")
    .select("id, name, capacity, sort_order, is_active")
    .order("sort_order", { ascending: true });

  const { data: settings, error: settingsError } = await supabase
    .from("event_settings")
    .select("value")
    .eq("key", "tables_locked")
    .maybeSingle();

  if (guestsError || tablesError || settingsError) {
    return {
      success: false,
      message: "No se pudo cargar la información de mesas.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Información cargada correctamente.",
    data: {
        guests: guests ?? [],
        tables: tables ?? [],
        tablesLocked: settings?.value ?? false,
        },
  };
}

export async function updateGuestTable(payload: {
  adminCode: string;
  guestId: string;
  tableNumber: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const selectedTable = payload.tableNumber.trim();

    if (selectedTable) {
    const { data: tableData, error: tableError } = await supabase
        .from("wedding_tables")
        .select("capacity")
        .eq("name", selectedTable)
        .single();

    if (tableError || !tableData) {
        return {
        success: false,
        message: "La mesa seleccionada no existe.",
        };
    }

    const { data: assignedGuests, error: assignedError } = await supabase
      .from("rsvps")
      .select("id")
      .eq("attendance", "SI")
      .eq("table_number", selectedTable)
      .neq("id", payload.guestId);

    if (assignedError) {
        return {
        success: false,
        message: "No se pudo validar la capacidad de la mesa.",
        };
    }

    if ((assignedGuests ?? []).length >= tableData.capacity) {
        return {
        success: false,
        message: "Esta mesa ya alcanzó su capacidad máxima.",
        };
    }
    }

  const { error } = await supabase
    .from("rsvps")
    .update({
      table_number: payload.tableNumber.trim() || null,
    })
    .eq("id", payload.guestId);

  if (error) {
    return {
      success: false,
      message: "No se pudo actualizar la mesa del invitado.",
    };
  }

  return {
    success: true,
    message: "Mesa actualizada correctamente.",
  };
}

export async function createWeddingTable(payload: {
  adminCode: string;
  name: string;
  capacity: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const tableName = payload.name.trim();

  if (!tableName) {
    return {
      success: false,
      message: "Debes ingresar el nombre de la mesa.",
    };
  }

  const tableCapacity = payload.capacity ? Number(payload.capacity) : 8;

  if (tableCapacity <= 0) {
    return {
      success: false,
      message: "La capacidad debe ser mayor a 0.",
    };
  }

  const { data: existingTables } = await supabase
    .from("wedding_tables")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder = existingTables?.[0]?.sort_order
    ? existingTables[0].sort_order + 1
    : 1;

  const { error } = await supabase.from("wedding_tables").insert({
    name: tableName,
    capacity: tableCapacity,
    sort_order: nextSortOrder,
    is_active: true,
  });

  if (error) {
    return {
      success: false,
      message: "No se pudo crear la mesa. Verifica que no exista una mesa con el mismo nombre.",
    };
  }

  return {
    success: true,
    message: "Mesa creada correctamente.",
  };
}

export async function updateWeddingTable(payload: {
  adminCode: string;
  tableId: string;
  name: string;
  capacity: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const tableName = payload.name.trim();

  if (!tableName) {
    return {
      success: false,
      message: "Debes ingresar el nombre de la mesa.",
    };
  }

  const tableCapacity = payload.capacity ? Number(payload.capacity) : 8;

  if (tableCapacity <= 0) {
    return {
      success: false,
      message: "La capacidad debe ser mayor a 0.",
    };
  }

  const { error } = await supabase
    .from("wedding_tables")
    .update({
      name: tableName,
      capacity: tableCapacity,
    })
    .eq("id", payload.tableId);

  if (error) {
    return {
      success: false,
      message: "No se pudo actualizar la mesa.",
    };
  }

  return {
    success: true,
    message: "Mesa actualizada correctamente.",
  };
}

export async function toggleWeddingTableStatus(payload: {
  adminCode: string;
  tableId: string;
  isActive: boolean;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const { error } = await supabase
    .from("wedding_tables")
    .update({
      is_active: !payload.isActive,
    })
    .eq("id", payload.tableId);

  if (error) {
    return {
      success: false,
      message: "No se pudo cambiar el estado de la mesa.",
    };
  }

  return {
    success: true,
    message: payload.isActive
      ? "Mesa desactivada correctamente."
      : "Mesa activada correctamente.",
  };
}

export async function deleteWeddingTable(payload: {
  adminCode: string;
  tableId: string;
}) {
  if (!validateAdminCode(payload.adminCode)) {
    return {
      success: false,
      message: "Código de administración incorrecto.",
    };
  }

  const { data: currentTable, error: tableError } = await supabase
    .from("wedding_tables")
    .select("name")
    .eq("id", payload.tableId)
    .single();

  if (tableError || !currentTable) {
    return {
      success: false,
      message: "No se pudo obtener la mesa seleccionada.",
    };
  }

  const { data: assignedGuests, error: guestsError } = await supabase
    .from("rsvps")
    .select("id")
    .eq("attendance", "SI")
    .eq("table_number", currentTable.name);

  if (guestsError) {
    return {
      success: false,
      message: "No se pudo validar si la mesa tiene invitados asignados.",
    };
  }

  if ((assignedGuests ?? []).length > 0) {
    return {
      success: false,
      message:
        "No se puede eliminar esta mesa porque tiene invitados asignados. Primero cambia o quita la mesa de esos invitados.",
    };
  }

  const { error } = await supabase
    .from("wedding_tables")
    .delete()
    .eq("id", payload.tableId);

  if (error) {
    return {
      success: false,
      message: "No se pudo eliminar la mesa.",
    };
  }

  return {
    success: true,
    message: "Mesa eliminada correctamente.",
  };
}

export async function moveTableOrder(payload: {
    adminCode: string;
    tableId: string;
    direction: "up" | "down";
    }) {
    if (!validateAdminCode(payload.adminCode)) {
        return {
        success: false,
        message: "Código de administración incorrecto.",
        };
    }

    const { data: tables, error: tablesError } = await supabase
        .from("wedding_tables")
        .select("id, sort_order")
        .order("sort_order", { ascending: true });

    if (tablesError || !tables) {
        return {
        success: false,
        message: "No se pudo obtener el orden de las mesas.",
        };
    }

    const currentIndex = tables.findIndex((table) => table.id === payload.tableId);

    if (currentIndex === -1) {
        return {
        success: false,
        message: "No se encontró la mesa seleccionada.",
        };
    }

    const targetIndex =
        payload.direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= tables.length) {
        return {
        success: false,
        message: "La mesa ya se encuentra en esa posición.",
        };
    }

    const currentTable = tables[currentIndex];
    const targetTable = tables[targetIndex];

    const { error: currentUpdateError } = await supabase
        .from("wedding_tables")
        .update({ sort_order: targetTable.sort_order })
        .eq("id", currentTable.id);

    if (currentUpdateError) {
        return {
        success: false,
        message: "No se pudo actualizar el orden de la mesa.",
        };
    }

    const { error: targetUpdateError } = await supabase
        .from("wedding_tables")
        .update({ sort_order: currentTable.sort_order })
        .eq("id", targetTable.id);

    if (targetUpdateError) {
        return {
        success: false,
        message: "No se pudo actualizar el orden de la mesa.",
        };
    }

    return {
        success: true,
        message: "Orden de mesas actualizado correctamente.",
    };
    }

    export async function bulkUpdateGuestTable(payload: {
        adminCode: string;
        guestIds: string[];
        tableNumber: string;
        }) {
        if (!validateAdminCode(payload.adminCode)) {
            return {
            success: false,
            message: "Código de administración incorrecto.",
            };
        }

        if (payload.guestIds.length === 0) {
            return {
            success: false,
            message: "Debes seleccionar al menos un invitado.",
            };
        }

        const selectedTable = payload.tableNumber.trim();

        if (!selectedTable) {
            return {
            success: false,
            message: "Debes seleccionar una mesa.",
            };
        }

        const { data: tableData, error: tableError } = await supabase
            .from("wedding_tables")
            .select("capacity")
            .eq("name", selectedTable)
            .single();

        if (tableError || !tableData) {
            return {
            success: false,
            message: "La mesa seleccionada no existe.",
            };
        }

        const { data: assignedGuests, error: assignedError } = await supabase
            .from("rsvps")
            .select("id")
            .eq("attendance", "SI")
            .eq("table_number", selectedTable)
            .not("id", "in", `(${payload.guestIds.join(",")})`);

        if (assignedError) {
            return {
            success: false,
            message: "No se pudo validar la capacidad de la mesa.",
            };
        }

        const currentAssignedCount = assignedGuests?.length ?? 0;
        const finalCount = currentAssignedCount + payload.guestIds.length;

        if (finalCount > tableData.capacity) {
            return {
            success: false,
            message: `No se puede asignar. La mesa solo tiene ${
                tableData.capacity - currentAssignedCount
            } asiento(s) disponible(s).`,
            };
        }

        const { error } = await supabase
            .from("rsvps")
            .update({
            table_number: selectedTable,
            })
            .in("id", payload.guestIds);

        if (error) {
            return {
            success: false,
            message: "No se pudo asignar la mesa a los invitados seleccionados.",
            };
        }

        return {
            success: true,
            message: "Invitados asignados correctamente.",
        };
        }

        export async function toggleTablesLocked(payload: {
            adminCode: string;
            currentValue: boolean;
            }) {
            if (!validateAdminCode(payload.adminCode)) {
                return {
                success: false,
                message: "Código de administración incorrecto.",
                };
            }

            const { error } = await supabase
                .from("event_settings")
                .update({
                value: !payload.currentValue,
                updated_at: new Date().toISOString(),
                })
                .eq("key", "tables_locked");

            if (error) {
                return {
                success: false,
                message: "No se pudo actualizar el bloqueo de mesas.",
                };
            }

            return {
                success: true,
                message: payload.currentValue
                ? "Distribución de mesas desbloqueada correctamente."
                : "Distribución de mesas finalizada y bloqueada correctamente.",
            };
            }