export default function Footer() {
  return (
    <footer className="border-t dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Digital Life Lessons" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white">Digital Life Lessons</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real experiences, practical wisdom—organized as lessons you can save, react, and revisit.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-bold text-slate-900 dark:text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Email: support@digitallifelessons.com</li>
            <li>Phone: +880 1XXX-XXXXXX</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="font-bold text-slate-900">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="font-bold text-slate-900">Social</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Facebook</li>
            <li>X (Twitter)</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
