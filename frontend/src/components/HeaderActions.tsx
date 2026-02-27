type HeaderActionsProps = {
  onSavedClick?: () => void;
  onAddClick?: () => void;
};

export default function HeaderActions({
  onSavedClick,
  onAddClick,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSavedClick}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#8B5E66] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7A4D54]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Salvos
      </button>
      <button
        type="button"
        onClick={onAddClick}
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-md bg-[#8B5E66] text-white transition hover:bg-[#7A4D54]"
        aria-label="Adicionar"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
