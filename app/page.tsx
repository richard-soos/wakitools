const Home = () => {
  return (
    <main className="relative isolate min-h-max flex flex-col justify-center items-center overflow-hidden bg-background px-[clamp(1.25rem,4vw,4.5rem)] text-foreground">
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
          Use it if it&apos;s useful.
        </p>
      </section>

      <p className="m-0 justify-self-center py-6 text-[0.72rem] font-semibold tracking-[0.12em] text-muted uppercase">
        WakiTools Free
      </p>
    </main>
  );
};

export default Home;
