'use client';
import { useEffect, useState } from 'react';
import DashboardCard from "./components/dashboardcard";
import supabase from '@/utils/supabaseClient';

export default function Dashboard() {
  const [lawyerLists1count, setLawyerLists1count] = useState([]);
  const [lawyerLists2count, setLawyerLists2count] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyers1 = async () => {
      const { count, error } = await supabase
        .from('lawyers')
        .select('id', { count: 'exact' })
        .eq('list_number', 1);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLawyerLists1count(count);
      }
      setLoading(false);
    };
    const fetchLawyers2 = async () => {
      const { count, error } = await supabase
        .from('lawyers')
        .select('id', { count: 'exact' })
        .eq('list_number', 2);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLawyerLists2count(count);
      }
      setLoading(false);
    };

    fetchLawyers1();
    fetchLawyers2();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">บัญชีรายชื่อทนายขอแรง </h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="ทนายบัญชีที่ 1 ทั้งหมด" value={lawyerLists1count} />
        <DashboardCard title="ทนายบัญชีที่ 1 ปัจจุบันลำดับที่" value=""/>
        <DashboardCard title="ทนายบัญชีที่ 2 ทั้งหมด" value={lawyerLists2count} />
        <DashboardCard title="ทนายบัญชีที่ 2 ปัจจุบันลำดับที่" value="" />
      </section>
    </>
  );
}