const PILLARS = [
  {
    number: '01',
    title: 'First Impressions Are Formed Online',
    body: 'Before a customer calls or walks in, they search, compare, and evaluate. An inspection reveals whether your platforms communicate credibility — or create doubt.',
  },
  {
    number: '02',
    title: 'Inconsistency Erodes Trust',
    body: 'Mismatched hours, outdated photos, and conflicting information across Google, social, and your website signal neglect. We identify where your presence diverges.',
  },
  {
    number: '03',
    title: 'Visibility Directly Affects Revenue',
    body: 'Businesses with strong platform health are discovered more often and convert at higher rates. Our assessment quantifies the gaps holding you back.',
  },
];

export default function WhyThisMatters() {
  return (
    <section className="no-print border-b border-serene-100 bg-serene-50/40 py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Why This Matters</p>
          <h2 className="section-title mt-4">
            Your Online Presence Is Your First Inspection
          </h2>
          <p className="section-subtitle">
            Customers evaluate your business long before they reach out. A platform health
            inspection surfaces the issues that cost you visibility, trust, and revenue —
            before your competitors capitalize on them.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {PILLARS.map(({ number, title, body }) => (
            <article
              key={number}
              className="border-t-2 border-serene-900 bg-white px-6 py-8 sm:px-8 sm:py-10"
            >
              <p className="font-serif text-2xl font-medium text-serene-300">{number}</p>
              <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-serene-900">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-serene-500 sm:text-[15px]">
                {body}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-14 text-center text-xs text-serene-400 sm:mt-16">
          Inspection methodology aligned with industry-standard digital presence audits
        </p>
      </div>
    </section>
  );
}
