const team = [
  { name: 'Anëtari/ja 1', role: 'Frontend & UI (komponentë, Tailwind, faqet publike)' },
  { name: 'Anëtari/ja 2', role: 'Backend & Autentifikim (NextAuth, API routes, MongoDB)' },
  { name: 'Anëtari/ja 3', role: 'Admin Panel, Testim (Jest/RTL) & Deployment' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Rreth Projektit</h1>
        <p className="text-gray-600">
          LibraShelf është një aplikacion ueb i zhvilluar si projekt për lëndën <strong>Zhvillim i Ueb-it në Anën e
          Klientit</strong>. Aplikacioni simulon një librari online ku përdoruesit mund të shfletojnë libra, të lënë
          koment e vlerësim, t'i ruajnë librat e preferuar dhe të menaxhojnë profilin e tyre. Administratorët kanë
          qasje në një panel të veçantë për menaxhimin e katalogut të librave.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Teknologjitë e Përdorura</h2>
        <ul className="list-inside list-disc space-y-1 text-gray-600">
          <li>Next.js (Pages Router) – SSR, SSG, ISR</li>
          <li>NextAuth.js – autentifikim me Credentials dhe Google OAuth</li>
          <li>MongoDB & Mongoose – ruajtja e të dhënave</li>
          <li>Tailwind CSS – stilizim responsive</li>
          <li>react-hook-form – validim i formularëve</li>
          <li>Jest & React Testing Library – testim</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Grupi</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
