import DashboardCard from "./components/dashboardcard";

export default function Dashboard() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">บัญชีรายชื่อทนายขอแรง </h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="ทนายบัญชีที่ 1 ทั้งหมด" value="1,234" />
        <DashboardCard title="ทนายบัญชีที่ 1 ปัจจุบันลำดับที่" value="$12,345" />
        <DashboardCard title="ทนายบัญชีที่ 2 ทั้งหมด" value="89%" />
        <DashboardCard title="ทนายบัญชีที่ 2 ปัจจุบันลำดับที่" value="3" />
      </section>
    </>
  );
}