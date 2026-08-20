import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const SUPPORT_EMAIL = "support@crazything.dev";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("CrazyThing support — message from " + form.name);
    const body = encodeURIComponent(form.message + "\n\n— " + form.name + " (" + form.email + ")");
    window.location.href = "mailto:" + SUPPORT_EMAIL + "?subject=" + subject + "&body=" + body;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
          Get in touch
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink_text-hi sm:text-4xl">
          We're here to help
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink_text-mid">
          Questions about an order, a listing, or your account? Send us a
          message and we'll get back to you.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.3fr]">
        {/* Info panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10">
              <Mail size={17} className="text-ember" />
            </div>
            <p className="mt-3 text-sm font-medium text-ink_text-hi">Email us</p>
            <p className="mt-1 text-sm text-ink_text-mid">harshitaparsendiya@gmail.com</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10">
              <MapPin size={17} className="text-ember" />
            </div>
            <p className="mt-3 text-sm font-medium text-ink_text-hi">Based in</p>
            <p className="mt-1 text-sm text-ink_text-mid">Kota, Rajasthan, India</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          {sent ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={36} className="text-signal-green" />
              <p className="mt-3 text-sm font-medium text-ink_text-hi">Your email client should have opened</p>
              <p className="mt-1 text-sm text-ink_text-mid">
                If it didn't, email us directly at harshitaparsendiya@gmail.com
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Your name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">Message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
                />
              </label>
              <Button type="submit" size="lg">
                <Send size={15} /> Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}