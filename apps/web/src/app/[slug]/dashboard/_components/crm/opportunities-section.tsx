"use client";
"use no memo";

import * as React from "react";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDownIcon, ListFilter } from "lucide-react";

import { Button } from "@cykani/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@cykani/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@cykani/ui/dropdown-menu";
import { Input } from "@cykani/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@cykani/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@cykani/ui/table";

import { profilesColumns } from "./opportunities-table/columns";
import profilesData from "./opportunities-table/data.json";
import { profilesSchema } from "./opportunities-table/schema";

const statusOptions = ["all", "Running", "Idle", "Provisioning"] as const;
const healthOptions = ["all", "Healthy", "Warning", "Critical", "Offline"] as const;
const profiles = profilesSchema.parse(profilesData);

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function OpportunitiesSection() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: profiles,
    columns: profilesColumns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });
  const searchQuery = table.getState().globalFilter ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  const healthFilter = (table.getColumn("health")?.getFilterValue() as string) ?? "all";
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const filteredProfileCount = table.getFilteredRowModel().rows.length;
  const visibleProfileCount = table.getRowModel().rows.length;
  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Active Profiles</CardTitle>
          <CardDescription>
            Monitor deployed browser profiles, their status, region, and health across your infrastructure.
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                className="h-7 w-44 md:w-52"
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value || undefined);
                  table.setPageIndex(0);
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="size-4" />
                    Status
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={(value: string) => {
                      table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
                      table.setPageIndex(0);
                    }}
                  >
                    {statusOptions.map((option) => (
                      <DropdownMenuRadioItem key={option} value={option}>
                        {option === "all" ? "All statuses" : option}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="size-4" />
                    Health
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuRadioGroup
                    value={healthFilter}
                    onValueChange={(value: string) => {
                      table.getColumn("health")?.setFilterValue(value === "all" ? undefined : value);
                      table.setPageIndex(0);
                    }}
                  >
                    {healthOptions.map((option) => (
                      <DropdownMenuRadioItem key={option} value={option}>
                        {option === "all" ? "All health" : option}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="overflow-hidden">
            <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
              <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 pb-1">
            <p className="text-muted-foreground text-sm">
              Viewing {visibleProfileCount} out of {filteredProfileCount.toLocaleString()} profiles
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.previousPage();
                    }}
                  />
                </PaginationItem>
                {pageNumbers[0] > 1 ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink
                      href="#"
                      isActive={table.getState().pagination.pageIndex === pageNumber - 1}
                      onClick={(event) => {
                        preventPaginationNavigation(event);
                        table.setPageIndex(pageNumber - 1);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                    onClick={(event) => {
                      preventPaginationNavigation(event);
                      table.nextPage();
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
