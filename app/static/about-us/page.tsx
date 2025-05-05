import NavBar from "@/app/static/components/nav-bar";


export default function Home() {
  return (
    <>
      <NavBar pageName="About Us" />
      <main>
        <section className="center-center h-full">
          <h1 className="text-4xl">About us page</h1>
        </section>
      </main>
    </>
  );
}
