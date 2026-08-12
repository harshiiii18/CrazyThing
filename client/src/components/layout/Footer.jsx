import { Link } from "react-router-dom";

const columns = [
  {
    title: "Marketplace",
    links: [
      ["Browse products", "/products"],
      ["Categories", "/products"],
      ["Sell an item", "/sell"],
      ["How CrazyThing works", "/#how-it-works"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help center", "/help"],
      ["Trust & safety", "/#trust"],
      ["Report an issue", "/report"],
      ["Contact us", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Careers", "/careers"],
      ["Terms of service", "/terms"],
      ["Privacy policy", "/privacy"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="font-display text-xl font-bold text-ink_text-hi">
              Crazy<span className="text-ember">Thing</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink_text-mid">
              Buy. Sell. Discover everything. A marketplace for people who have
              things to pass on, and people looking for exactly that thing.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-medium text-ink_text-hi">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-ink_text-mid hover:text-ember-soft"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink_text-low sm:flex-row">
          <span>© {new Date().getFullYear()} CrazyThing. All rights reserved.</span>
          <span>Made for buyers and sellers who move fast.</span>
        </div>
      </div>
    </footer>
  );
}
