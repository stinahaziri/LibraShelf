import Button from './Button';

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = 'Konfirmo', danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {title && <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>}
        <div className="mb-5 text-sm text-gray-600">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Anulo
          </Button>
          {onConfirm && (
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
