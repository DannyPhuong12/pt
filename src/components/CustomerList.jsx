import { useState, useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import customerService from '../services/customerService'
import CustomerModal from './CustomerModal'

const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = () => {
    customerService
      .getCustomers()
      .then(setCustomers)
      .catch(() => setError('Asiakkaiden lataaminen epäonnistui.'))
  }

  const handleDelete = (href) => {
    if (!window.confirm('Haluatko varmasti poistaa asiakkaan? Tämä poistaa myös kaikki harjoitukset.')) return
    customerService
      .deleteCustomer(href)
      .then(fetchCustomers)
      .catch(() => setError('Poistaminen epäonnistui.'))
  }

  const handleSave = (customerData) => {
    const action = editingCustomer
      ? customerService.updateCustomer(editingCustomer.href, customerData)
      : customerService.addCustomer(customerData)
    action
      .then(() => {
        fetchCustomers()
        setModalOpen(false)
        setEditingCustomer(null)
      })
      .catch(() => setError('Tallennus epäonnistui.'))
  }

  const exportCSV = () => {
    const headers = ['Etunimi', 'Sukunimi', 'Sähköposti', 'Puhelin', 'Katuosoite', 'Postinumero', 'Kaupunki']
    const rows = customers.map((c) => [
      c.firstname, c.lastname, c.email, c.phone, c.streetaddress, c.postcode, c.city
    ])
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'asiakkaat.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = useMemo(
    () => [
      { accessorKey: 'firstname', header: 'Etunimi' },
      { accessorKey: 'lastname', header: 'Sukunimi' },
      { accessorKey: 'email', header: 'Sähköposti' },
      { accessorKey: 'phone', header: 'Puhelin' },
      { accessorKey: 'streetaddress', header: 'Katuosoite' },
      { accessorKey: 'postcode', header: 'Postinumero' },
      { accessorKey: 'city', header: 'Kaupunki' },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="actions-cell">
            <button
              className="btn-edit-row"
              onClick={() => { setEditingCustomer(row.original); setModalOpen(true) }}
            >
              Muokkaa
            </button>
            <button className="btn-del-row" onClick={() => handleDelete(row.original.href)}>
              Poista
            </button>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: customers,
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
        <h1>Asiakkaat</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportCSV}>⬇ Vie CSV</button>
          <button className="btn-primary" onClick={() => { setEditingCustomer(null); setModalOpen(true) }}>
            + Lisää asiakas
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}<button onClick={() => setError(null)}>×</button>
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
            placeholder="Hae asiakkaita..."
          />
        </div>
        <span className="car-count">{table.getRowModel().rows.length} asiakasta</span>
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
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingCustomer(null) }}
        />
      )}
    </div>
  )
}

export default CustomerList