"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import Image from "next/image";
import { submitRSVP } from "@/lib/supabase-client";

export function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const scrollSectionIntoView = useEffectEvent(() => {
    const element = sectionRef.current;
    if (!element) {
      return;
    }

    window.setTimeout(() => {
      window.scrollTo({
        top: Math.max(0, element.offsetTop - 20),
        behavior: "smooth",
      });
    }, 180);
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const handleFocusIn = () => {
      scrollSectionIntoView();
    };

    section.addEventListener("focusin", handleFocusIn);

    return () => {
      section.removeEventListener("focusin", handleFocusIn);
    };
  }, [scrollSectionIntoView]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("请输入姓名");
      return;
    }

    const guestCount = Number(guests);
    if (!Number.isFinite(guestCount) || guestCount < 1) {
      setError("请输入正确的出席人数");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRSVP(name.trim(), guestCount);

      startTransition(() => {
        setName("");
        setGuests("");
        setMessage("已提交成功");
      });
    } catch {
      setError("提交失败，请检查网络后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#4d1c20]"
    >
      <Image
        src="/page-5.jpg"
        alt="婚礼邀请函第五页 RSVP"
        width={1080}
        height={665}

        sizes="100vw"
        className="block h-auto w-full"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="mt-[29%] flex w-full max-w-[13.5rem] flex-col gap-2.5"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="姓名"
            autoComplete="name"
            className="h-9 w-full border border-[#d8b47b]/60 bg-[#fbf1df]/92 px-3 text-center text-[15px] text-[#5a2326] outline-none transition placeholder:text-[#9a7a53] focus:border-[#c59b58] focus:ring-2 focus:ring-[#d7b27a]/30"
          />

          <input
            value={guests}
            onChange={(event) => setGuests(event.target.value.replace(/[^\d]/g, ""))}
            placeholder="人数"
            inputMode="numeric"
            enterKeyHint="done"
            className="h-9 w-full border border-[#d8b47b]/60 bg-[#fbf1df]/92 px-3 text-center text-[15px] text-[#5a2326] outline-none transition placeholder:text-[#9a7a53] focus:border-[#c59b58] focus:ring-2 focus:ring-[#d7b27a]/30"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-full border border-[#d8b47b]/65 bg-[#f0d8ab] text-[15px] text-[#5a2326] transition active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting ? "提交中" : "提交"}
          </button>

          <div className="min-h-4 text-center text-[11px]">
            {error ? <p className="text-[#ffd8cf]">{error}</p> : null}
            {!error && message ? <p className="text-[#f5dfb8]">{message}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
