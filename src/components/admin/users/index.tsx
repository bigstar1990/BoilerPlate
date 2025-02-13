'use client'
import React, { useState } from 'react'
import getUserColumnDef, { getFieldConfigs } from './columns'
import { z } from 'zod'
import { DataTable } from '@/components/ui/shadcn-data-table/data-table'
import { getColumnnnDef } from '@/components/ui/shadcn-data-table/columns'
import User from '@/types/user'
import { createUserAdmin, deleteUserAdmin } from '@/actions/user'
import CustomUpdateForm from '@/components/ui/better-form'
import DeletePopup from '@/components/ui/better-form/deletePopUp'

const UsersAdminDatatable = ({ users }: { users: User[] }) => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = React.useState(false)
  const onCreate = (data: any) => {
    console.log(data, currentUser ? currentUser.id : undefined)

    setOpen(true)
    setLoading(true)
    createUserAdmin({ ...data, id: currentUser ? currentUser.id : undefined }).then(
      (res) => {
        console.log(res)
        setLoading(false)
        setOpen(false)
        setCurrentUser(null)
      }
    )
  }

  const onEdit = (row: any) => {
    console.log(row)
    setCurrentUser(row.row.original)
    setOpen(true)
  }

  const onDelete = (row: any) => {
    console.log('Delete', row)
    setUserToDelete(row.row.original)
  }

  return (
    <>
      {/* Passer les données actuelles de l'utilisateur si on est en mode édition */}
      {open && (
        <CustomUpdateForm
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={onCreate}
          fieldConfigs={getFieldConfigs({ users })}
          data={currentUser} // Passe l'utilisateur actuel pour l'édition
          loading={loading}
        />
      )}

      {userToDelete && (
        <DeletePopup
          open={!!userToDelete}
          loading={deleteLoading}
          onClose={() => setUserToDelete(null)}
          message='Are you sure you want to delete this user?'
          onConfirm={() => {
            setDeleteLoading(true)
            deleteUserAdmin({ id: userToDelete?.id as string }).then((res) => {
              if (res.success) {
                setUserToDelete(null)
                setDeleteLoading(false)
              }
            })
          }}
        />
      )}

      <DataTable
        data={users}
        columns={getColumnnnDef(getUserColumnDef(onEdit, onDelete))}
        onCreate={() => {
          setCurrentUser(null)
          setOpen(true)
        }}
      />
    </>
  )
}

export default UsersAdminDatatable
