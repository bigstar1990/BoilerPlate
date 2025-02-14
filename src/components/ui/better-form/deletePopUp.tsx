import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { BetterButton } from '@/components/shadcn/betterButton'

interface DeletePopupProps {
  open: boolean
  onClose: () => void
  loading?: boolean
  message: string
  onConfirm: () => void
}

const DeletePopup = ({
  open,
  onClose,
  message,
  onConfirm,
  loading,
}: DeletePopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            {message ||
              'Are you sure you want to delete this item? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex w-full justify-between'>
            <BetterButton
              loading={loading}
              type='button'
              variant={'destructive'}
              onClick={onConfirm}
            >
              Confirm
            </BetterButton>
            <BetterButton type='button' variant='secondary' onClick={onClose}>
              Cancel
            </BetterButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePopup
