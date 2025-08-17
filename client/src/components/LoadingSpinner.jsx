export default function LoadingSpinner() {
  return (
    <div
      className="flex absolute items-center justify-center"
      style={{ left: "calc(50% - 2rem)", top: "calc(50% - 2rem)" }}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
    </div>
  );
}
