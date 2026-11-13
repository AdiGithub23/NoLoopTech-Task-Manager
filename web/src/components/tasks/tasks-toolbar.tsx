"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, TASK_STATUSES, type TaskStatus } from "@/types/task";

export type StatusFilter = "ALL" | TaskStatus;
export type SortOrder = "NEWEST" | "DUE_ASC" | "DUE_DESC";

interface TasksToolbarProps {
  statusFilter: StatusFilter;
  sortOrder: SortOrder;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSortOrderChange: (value: SortOrder) => void;
}

export function TasksToolbar({
  statusFilter,
  sortOrder,
  onStatusFilterChange,
  onSortOrderChange,
}: TasksToolbarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="status-filter">Filter by status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
        >
          <SelectTrigger id="status-filter" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sort-order">Sort by</Label>
        <Select
          value={sortOrder}
          onValueChange={(value) => onSortOrderChange(value as SortOrder)}
        >
          <SelectTrigger id="sort-order" className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Newest first</SelectItem>
            <SelectItem value="DUE_ASC">Due date: earliest first</SelectItem>
            <SelectItem value="DUE_DESC">Due date: latest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
