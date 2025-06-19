import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

const Card = ({ transaction }) => {
  const { type, description, amount, date, category } = transaction;
  const isIncome = type === "Ingreso";
  const colorClass = isIncome ? "text-emerald-200" : "text-rose-200";
  const categoryName = category?.name || "Sin categoría";

  return (
    <li className="p-3 bg-stone-800 text-white rounded-lg flex justify-between items-center shadow mb-2 hover:bg-stone-700 transition-colors">
      <div className="flex items-center gap-3">
        {isIncome ? (
          <CircleArrowUp size={30} className={colorClass} />
        ) : (
          <CircleArrowDown size={30} className={colorClass} />
        )}
        <div>
          <p className={`text-lg font-semibold ${colorClass}`}>
            {description || "Sin descripción"}
          </p>
          <p className="text-sm text-stone-400">{categoryName}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${colorClass}`}>
          ${amount.toLocaleString()}
        </p>
        <p className="text-xs text-stone-400">
          {new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </p>
      </div>
    </li>
  );
};

export default Card;