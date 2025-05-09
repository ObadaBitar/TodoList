import NavBar from "@/app/static/components/nav-bar";


export default function Home() {
  return (
    <>
      <NavBar pageName="Home" />
      <main>
        <section className="center-center flex-col h-full gap-3">
          {/* TODO WORK ON THIS */}
          <h1 className="text-4xl">TASK MANGER</h1>
          <p className="text-1xl">MANGE YOUR LIFE</p>
          {/* MAYBE BUTTON TO REDIRECT US */}
        </section>
      </main>
    </>
  );
}
