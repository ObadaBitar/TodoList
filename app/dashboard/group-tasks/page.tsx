import NavBar from "@/app/dashboard/components/nav-bar";

export default function GroupTasks() {
    return (
        <>
            <NavBar pageName="Group Tasks" />
            <main>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="mt-4 text-lg">Welcome to the dashboard!</p>
            </main>
        </>
    );
}   