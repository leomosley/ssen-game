import * as React from "react"

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange?.(false)}
          />
          <div className="relative z-50 max-w-lg w-full mx-4">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      {children}
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-slate-900">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600 mt-2">{children}</p>
}

export function DialogClose({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
    >
      {children}
    </button>
  )
}
