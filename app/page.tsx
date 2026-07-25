import Link from "next/link";

const Home = () => {
  return (
    <main className="relative isolate grid min-h-dvh grid-rows-[auto_1fr_auto] overflow-hidden bg-background px-[clamp(1.25rem,4vw,4.5rem)] text-foreground">
      <div
        className="pointer-events-none absolute top-[44%] left-1/2 -z-10 size-[min(70vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[6rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-52 -right-28 -z-10 size-[22rem] rounded-full border border-primary/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-60 -left-32 -z-10 size-[26rem] rounded-full border border-primary/10"
        aria-hidden="true"
      />

      <header className="mx-auto flex w-full max-w-[90rem] items-center justify-between py-5 sm:py-6">
        <Link
          className="inline-flex items-center gap-3 text-sm font-bold tracking-[-0.01em] text-foreground no-underline"
          href="/"
          aria-label="Waki Tools home"
        >
          <span
            className="grid size-8 place-items-center rounded-[0.65rem] bg-foreground text-xs font-extrabold text-background shadow-[0_0.5rem_1.5rem_rgba(19,32,29,0.12)]"
            aria-hidden="true"
          >
            W
          </span>
          <span>Waki Tools</span>
        </Link>

        <nav
          className="min-h-8 min-w-[clamp(3rem,18vw,18rem)]"
          aria-label="Primary navigation"
        />
      </header>

      <section
        className="flex w-full max-w-[52rem] self-center justify-self-center flex-col items-center pt-12 pb-12 text-center sm:pb-20"
        aria-labelledby="welcome-title"
      >
        <p className="mb-6 inline-flex items-center gap-[0.6rem] text-[clamp(0.72rem,1.5vw,0.8rem)] font-bold tracking-[0.1em] text-muted uppercase">
          NO SIGN UP • JUST TOOLS
        </p>

        <h1
          id="welcome-title"
          className="text-primary m-0 text-[clamp(3.1rem,12vw,7.5rem)] leading-[0.91] font-[750] tracking-[-0.075em] text-foreground"
        >
          Built because I needed it.
        </h1>

        <p className="mt-8 max-w-[34rem] text-[clamp(1rem,2vw,1.15rem)] leading-7 text-muted">
          Use it if it's useful.
        </p>
      </section>

      <p className="m-0 justify-self-center py-6 text-[0.72rem] font-semibold tracking-[0.12em] text-muted uppercase">
        Simple by design.
      </p>
    </main>
  );
};

export default Home;
