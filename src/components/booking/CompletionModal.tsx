export function CompletionModal({
  confirmationCode,
  isOpen,
  onClose,
  reservationNumber,
}: {
  confirmationCode: string
  isOpen: boolean
  onClose: () => void
  reservationNumber: string
}) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <div aria-modal="true" className="modal-card" role="dialog">
        <p className="card-kicker">送信完了</p>
        <h2>予約完了</h2>
        <p>
          送信を受け付けました。予約完了の TEL
          で確定となります。担当者からの連絡をお待ちください。
        </p>
        <div className="summary-items">
          <div className="summary-items__row">
            <span>予約番号</span>
            <span>{reservationNumber}</span>
          </div>
          <div className="summary-items__row">
            <span>確認キー</span>
            <span>{confirmationCode}</span>
          </div>
        </div>
        <button className="button button-primary" onClick={onClose} type="button">
          閉じる
        </button>
      </div>
    </div>
  )
}
