'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnResizeMode,
} from '@tanstack/react-table'
import Image from 'next/image'

const NoCandidate = () => (
  <div className="flex flex-col flex-grow justify-center items-center text-center gap-3 h-[80vh]">
    <div className="relative w-[320px] h-[320px]">
      <Image
        src="/asset/vektor/empty-candidate.svg"
        alt="empty candidate"
        fill
        className="object-contain"
      />
    </div>

    <p className="text-xl font-bold">No candidate found</p>
    <div className="text-gray-500 text-base">{`Share your job vacancies so that more candidates will apply.`}</div>
  </div>
)

interface CandidateAttribute {
  key: string
  label: string
  value: string
}

interface CandidateUser {
  id: string
  name: string
  email: string
  phone_number?: string
}

interface Candidate {
  id: string
  status?: string
  user: CandidateUser
  attributes: CandidateAttribute[]
}

export default function ManageCandidatePage() {
  const { jobId } = useParams()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!jobId) return
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`/api/v1/candidates/by-job/${jobId}`)
        setCandidates(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [jobId])

  const data = useMemo(() => {
    return candidates.map((c) => {
      const attr = Object.fromEntries(c.attributes.map((a) => [a.key, a.value]))
      return {
        id: c.id,
        full_name: attr.full_name || c.user.name,
        email: attr.email || c.user.email,
        phone_number: attr.phone_number || c.user.phone_number,
        date_of_birth: attr.date_of_birth ? new Date(attr.date_of_birth).toLocaleDateString('en-GB') : '-',
        domicile: attr.domicile || '-',
        gender: attr.gender || '-',
        linkedin_link: attr.linkedin_link || '-',
      }
    })
  }, [candidates])

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]) // unselect all
    } else {
      setSelectedIds(data.map((item) => item.id)) // select all
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-3">
            {/* Checkbox header (Select All) */}

            <input
              type="checkbox"
              checked={selectedIds.length === data.length && data.length > 0}
              onChange={toggleSelectAll}
              className="w-5 h-5 border-2 border-greenBorder rounded-md cursor-pointer appearance-none checked:bg-greenBorder checked:border-greenBorder checked:ring-1 checked:ring-greenBorder focus:outline-none"
            />
            <span>NAMA LENGKAP</span>
          </div>
        ),
        accessorKey: 'full_name',
        //  Checkbox per baris
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row, getValue }: any) => (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.original.id)}
              onChange={() => toggleSelect(row.original.id)}
              className="w-5 h-5 border-2 border-greenBorder rounded-md cursor-pointer appearance-none checked:bg-greenBorder checked:border-greenBorder checked:ring-1 checked:ring-greenBorder focus:outline-none"
            />
            <span>{getValue()}</span>
          </div>
        ),
      },
      { header: 'EMAIL ADDRESS', accessorKey: 'email' },
      { header: 'PHONE NUMBERS', accessorKey: 'phone_number' },
      { header: 'DATE OF BIRTH', accessorKey: 'date_of_birth' },
      { header: 'DOMICILE', accessorKey: 'domicile' },
      { header: 'GENDER', accessorKey: 'gender' },
      {
        header: 'LINK LINKEDIN',
        accessorKey: 'linkedin_link',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ getValue }: any) => (
          <a
            href={getValue()}
            target="_blank"
            rel="Link Direction"
            className="text-greenPrimary hover:underline"
          >
            {getValue()}
          </a>
        ),
      },
    ],
    [selectedIds, data]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  })

  if (loading) return <div className="p-8 text-center text-gray-600">Loading candidates...</div>

  if (!candidates.length) return <NoCandidate />

  return (
    <div className="p-6 flex flex-col h-[94vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Front End Developer</h2>
        {/* <p className="text-sm text-gray-500">
          Total Candidates: {candidates.length}
        </p> */}
      </div>

      <div className="flex overflow-auto grow border border-greyBorder rounded-lg shadow-lg">
        <div className="p-6 grow">
          <table className="min-w-full border border-greyBorder rounded-lg grow border-collapse text-sm text-left shadow-lg">
            <thead className="bg-whiteTable text-blackText font-bold text-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          position: 'relative',
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-4 py-3 font-semibold cursor-pointer select-none border border-greyOutline"
                      >
                        <div className="flex items-center justify-between">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="text-gray-400 text-xs ml-1">
                            {isSorted === 'asc' ? '▲' : isSorted === 'desc' ? '▼' : ''}
                          </span>
                        </div>

                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize ${
                            header.column.getIsResizing() ? 'bg-blue-400' : 'bg-transparent hover:bg-gray-300'
                          }`}
                        />
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap border border-greyOutline"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
