'use client'
import React, { useState } from 'react'
import { DataTable } from '@/components/ui/shadcn-data-table/data-table'
import { getColumnnnDef } from '@/components/ui/shadcn-data-table/columns'
import getUserColumnDef from './columns'
import { getFieldConfigs } from './columns'
import Account from '@/types/account'
import User from '@/types/user'
import { createAccountAdmin, deleteAccountAdmin } from '@/actions/account'
import CustomUpdateForm from '@/components/ui/better-form'
import DeletePopup from '@/components/ui/better-form/deletePopUp'

const AccountsAdminDatatable = ({
  accounts,
  users,
}: {
  accounts: Account[]
  users: User[]
}) => {
  const [open, setOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const onCreate = (data: any) => {
    setOpen(true)
    setLoading(true)
    console.log(data)
    createAccountAdmin(data).then((res) => {
      console.log(res)
      setLoading(false)
    })
  }

  const onEdit = (row: any) => {
    // On récupère le compte à éditer
    const accountToEdit = row.row.original
    console.log('accounts', accountToEdit)
    setCurrentAccount(accountToEdit) // On met le compte dans l'état
    setOpen(true) // On ouvre le formulaire
  }
  const onDelete = (row: any) => {
    console.log(row.row.original)

    setAccountToDelete(row.row.original)
  }

  return (
    <>
      {/* Passer les données actuelles du compte si on est en mode édition */}
      {open && (
        <CustomUpdateForm
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(values) => {
            console.log(values)
            // Effectuer la logique de soumission ici (update du compte dans la base de données, etc.)
          }}
          fieldConfigs={getFieldConfigs({ users })}
          data={currentAccount} // Passe le compte actuel pour l'édition
        />
      )}

      {accountToDelete && (
        <DeletePopup
          open={!!accountToDelete}
          loading={deleteLoading}
          onClose={() => setAccountToDelete(null)}
          message='Are you sure you want to delete this account?'
          onConfirm={() => {
            deleteAccountAdmin({ account_id: accountToDelete?.id as string }).then(
              (res) => {
                if (res.success) {
                  setAccountToDelete(null)
                  setDeleteLoading(false)
                } else {
                  console.log(res)
                }
              }
            )
          }}
        />
      )}

      <DataTable
        data={accounts}
        columns={getColumnnnDef(getUserColumnDef(onEdit, onDelete))}
        onCreate={() => {
          setCurrentAccount(null)
          setOpen(true)
        }}
      />
    </>
  )
}

export default AccountsAdminDatatable
