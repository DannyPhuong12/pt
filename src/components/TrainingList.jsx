import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import trainingService from '../services/trainingService'
import customerService from '../services/customerService'
import TrainingModal from './TrainingModal'

const TrainingList = () => {
  const [trainings, setTrainings] = useState([])
  const [customers, setCustomers] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrainings()
    customerService.getCustomers().then(setCustomers).catch(() => {})
  }, [])

  const fetchTrainings = () => {
    trainingService
      .getTrainings()
      .then(setTrainings)
      .catch(() => setError('Harjoitusten lataaminen epäonnistui.'))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Haluatko varmasti poistaa harjoituksen?')) return
    trainingService
      .deleteTraining(id)
      .then(fetchTrainings)
      .catch(() => setError('Poistaminen epäonnistui.'))
  }

  const handleAdd = (trainingData) => {
    trainingService
      .addTraining(trainingData)
      .then(() => {
        fetchTrainings()
        setModalOpen(false)
      })
      .catch(() => setError('Harjoituksen lisääminen epäonnistui.'))
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Päivämäärä',
        cell: ({ getValue }) =>
          getValue() ? dayjs(getValue()).format('DD.MM.YYYY HH:mm') : '—',
      },
      { accessorKey: 'activity', header: 'Aktiviteetti' },
      {
        accessorKey: 'duration',
        header: 'Kesto (min)',
      },
      {
        id: 'customer',
        header: 'Asiakas',
        accessorFn: (row) =>
          row.customer
            ? `${row.customer.firstname} ${row.customer.lastname}`
            : '—',
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="actions-cell">
            <button
              className="btn-del-row"
              onClick={() => handleDelete(row.original.id)}
            >
              Poista
            </button>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: trainings,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="page">
      <div className="page-header">
        <h1>Harjoitukset</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          + Lisää harjoitus
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="toolbar">
        <div className="search-wrap">
          <svg className="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="search-input"
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Hae harjoituksia..."
          />
        </div>
        <span className="car-count">{table.getRowModel().rows.length} harjoitusta</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty">Ei hakutuloksia</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <TrainingModal
          customers={customers}
          onSave={handleAdd}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default TrainingList