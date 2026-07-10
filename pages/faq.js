const faqs = [
  {
    q: 'Si mund të regjistrohem?',
    a: 'Klikoni te "Regjistrohu" në menu, plotësoni emrin, email-in dhe fjalëkalimin, ose kyçuni direkt me llogarinë tuaj Google.',
  },
  {
    q: 'A mund të lë koment për një libër?',
    a: 'Po, mjafton të jeni të kyçur. Hapni faqen e librit dhe plotësoni formularin e komentit në fund të faqes.',
  },
  {
    q: 'Si i shtoj librat në të preferuarat?',
    a: 'Klikoni ikonën e zemrës në kartën e librit ose butonin "Shto tek të Preferuarat" në faqen e detajeve.',
  },
  {
    q: 'Kush mund të shtojë libra të rinj?',
    a: 'Vetëm përdoruesit me rolin "admin" kanë qasje në Panelin e Administrimit për të shtuar, ndryshuar ose fshirë libra.',
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Pyetje të Shpeshta</h1>
      <div className="flex flex-col gap-4">
        {faqs.map((item) => (
          <details key={item.q} className="rounded-xl border border-gray-200 p-4">
            <summary className="cursor-pointer font-medium text-gray-900">{item.q}</summary>
            <p className="mt-2 text-sm text-gray-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
