const conditions = ["New", "Like New", "Good", "Fair", "Used"];

export default function FilterPanel({ filters, onChange, categories = [] }) {
  // categories: array of { _id, name } from the backend
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="mb-2.5 text-sm font-medium text-ink_text-hi">Category</h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => update({ category: "" })}
            className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
              !filters.category
                ? "bg-ember/10 text-ember-soft"
                : "text-ink_text-mid hover:bg-surface-raised"
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => update({ category: cat._id })}
              className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                filters.category === cat._id
                  ? "bg-ember/10 text-ember-soft"
                  : "text-ink_text-mid hover:bg-surface-raised"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2.5 text-sm font-medium text-ink_text-hi">Price range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink_text-hi outline-none focus:border-ember"
          />
          <span className="text-ink_text-low">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink_text-hi outline-none focus:border-ember"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2.5 text-sm font-medium text-ink_text-hi">Condition</h4>
        <div className="flex flex-wrap gap-1.5">
          {conditions.map((c) => (
            <button
              key={c}
              onClick={() =>
                update({ condition: filters.condition === c ? "" : c })
              }
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filters.condition === c
                  ? "border-ember bg-ember/10 text-ember-soft"
                  : "border-line text-ink_text-mid hover:border-ember/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-ink_text-mid">Verified sellers only</span>
        <button
          onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
          className={`h-6 w-11 rounded-full transition-colors ${
            filters.verifiedOnly ? "bg-ember" : "bg-surface-raised"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-ink_text-hi transition-transform ${
              filters.verifiedOnly ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
