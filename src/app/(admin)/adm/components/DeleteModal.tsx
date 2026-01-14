"use client";

interface DeleteUserModalProps {
  show: boolean;
  usuarioNome?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({
  show,
  usuarioNome,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Excluir Usuário</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Tem certeza que deseja excluir o usuário
                <strong> {usuarioNome}</strong>?
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
