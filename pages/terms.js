export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Kushtet e Përdorimit</h1>
      <div className="flex flex-col gap-4 text-sm text-gray-600">
        <p>
          Ky aplikacion (LibraShelf) është zhvilluar vetëm për qëllime edukative, si projekt për lëndën "Zhvillim i
          Ueb-it në Anën e Klientit". Të dhënat e futura (libra, komente, mesazhe) përdoren vetëm brenda mjedisit të
          projektit dhe nuk janë pjesë e ndonjë shërbimi komercial.
        </p>
        <p>
          Duke krijuar një llogari, pranoni që informacionet tuaja (emri, email-i) do të ruhen në bazën e të dhënave
          MongoDB të projektit dhe do të përdoren vetëm për funksionalitetin e aplikacionit (kyçje, komente, të
          preferuara).
        </p>
        <p>Administratorët e projektit mund të fshijnë përmbajtje që shkel rregullat bazë të sjelljes.</p>
      </div>
    </div>
  );
}
