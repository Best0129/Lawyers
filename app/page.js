'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, List, Users, UserCheck, Loader2, Layers, ClipboardList, User, CheckCircle } from 'lucide-react';
import DashboardCard from "./components/dashboardcard";
import supabase from '@/utils/supabaseClient';

// StatusBubble Component
const StatusBubble = ({ status }) => {
  let color = 'bg-gray-400';
  let textColor = 'text-white';
  if (status === 'ว่าง') color = 'bg-green-500';
  else if (status === 'ไม่ว่าง') color = 'bg-red-500';
  else if (status === 'อื่น ๆ') {
    color = 'bg-yellow-500';
    textColor = 'text-black';
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color} ${textColor}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [lawyerLists1count, setLawyerLists1count] = useState(0);
  const [lawyerLists2count, setLawyerLists2count] = useState(0);
  const [currentLawyer1, setCurrentLawyer1] = useState(null);
  const [currentLawyer2, setCurrentLawyer2] = useState(null);
  const [lawyerList1, setLawyerList1] = useState([]);
  const [lawyerList2, setLawyerList2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count: count1, error: error1 } = await supabase
          .from('lawyers')
          .select('id', { count: 'exact' })
          .eq('list_number', 1);
        if (error1) throw error1;
        setLawyerLists1count(count1);

        const { count: count2, error: error2 } = await supabase
          .from('lawyers')
          .select('id', { count: 'exact' })
          .eq('list_number', 2);
        if (error2) throw error2;
        setLawyerLists2count(count2);

        const { data: firstAvailable1, error: error3 } = await supabase
          .from('lawyers')
          .select('id')
          .eq('list_number', 1)
          .eq('status', 'ว่าง')
          .order('id', { ascending: true })
          .limit(1)
          .single();
        if (error3 && error3.code !== 'PGRST116') throw error3;
        setCurrentLawyer1(firstAvailable1?.id || 'ไม่มี');

        const { data: firstAvailable2, error: error4 } = await supabase
          .from('lawyers')
          .select('id')
          .eq('list_number', 2)
          .eq('status', 'ว่าง')
          .order('id', { ascending: true })
          .limit(1)
          .single();
        if (error4 && error4.code !== 'PGRST116') throw error4;

        if (firstAvailable2) {
          const { count: positionCount, error: error5 } = await supabase
            .from('lawyers')
            .select('id', { count: 'exact' })
            .eq('list_number', 2)
            .lt('id', firstAvailable2.id);
          if (error5) throw error5;
          setCurrentLawyer2(positionCount + 1);
        } else {
          setCurrentLawyer2('ไม่มี');
        }

        const { data: lawyers1, error: error6 } = await supabase
          .from('lawyers')
          .select('id, first_name, last_name, status')
          .eq('list_number', 1)
          .order('id', { ascending: true });
        if (error6) throw error6;
        setLawyerList1(lawyers1);

        const { data: lawyers2, error: error7 } = await supabase
          .from('lawyers')
          .select('id, first_name, last_name, status')
          .eq('list_number', 2)
          .order('id', { ascending: true });
        if (error7) throw error7;
        setLawyerList2(lawyers2);
      } catch (error) {
        setFetchError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" size={48} /></div>;

  if (fetchError) return <p className="text-red-600">Error: {fetchError}</p>;

  return (
    <div className="p-8 flex flex-col min-h-screen">
      <header className="mb-8 flex items-center gap-2">
        <Layers className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">บัญชีรายชื่อทนายขอแรง</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title={<span className="flex items-center gap-2"><Users size={18} /> ทนายบัญชีที่ 1 ทั้งหมด</span>} value={lawyerLists1count} />
        <DashboardCard title={<span className="flex items-center gap-2"><UserCheck size={18} /> ทนายบัญชีที่ 1 ปัจจุบันลำดับที่</span>} value={currentLawyer1} />
        <DashboardCard title={<span className="flex items-center gap-2"><Users size={18} /> ทนายบัญชีที่ 2 ทั้งหมด</span>} value={lawyerLists2count} />
        <DashboardCard title={<span className="flex items-center gap-2"><UserCheck size={18} /> ทนายบัญชีที่ 2 ปัจจุบันลำดับที่</span>} value={currentLawyer2} />
      </section>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* List 1 */}
        <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><List /> ทนายบัญชีที่ 1</h2>
          {lawyerList1.length === 0 ? (
            <p>ไม่มีข้อมูล</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="w-16 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <ClipboardList size={16} /> ลำดับ
                    </div>
                  </th>
                  <th className="w-48 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <User size={16} /> ชื่อ-นามสกุล
                    </div>
                  </th>
                  <th className="w-24 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle size={16} /> สถานะ
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lawyerList1.slice(0, 12).map((lawyer, index) => (
                  <tr key={lawyer.id} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{lawyer.first_name} {lawyer.last_name}</td>
                    <td className="p-2 text-center">
                      <StatusBubble status={lawyer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end">
            <Link href="/list_1" className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700">
              ดูรายชื่อทั้งหมดบัญชีที่ 1
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* List 2 */}
        <div className="bg-white p-4 shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><List /> ทนายบัญชีที่ 2</h2>
          {lawyerList2.length === 0 ? (
            <p>ไม่มีข้อมูล</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="w-16 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <ClipboardList size={16} /> ลำดับ
                    </div>
                  </th>
                  <th className="w-48 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <User size={16} /> ชื่อ-นามสกุล
                    </div>
                  </th>
                  <th className="w-24 p-2 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle size={16} /> สถานะ
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lawyerList2.slice(0, 12).map((lawyer, index) => (
                  <tr key={lawyer.id} className="hover:bg-gray-50">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{lawyer.first_name} {lawyer.last_name}</td>
                    <td className="p-2 text-center">
                      <StatusBubble status={lawyer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end">
            <Link href="/list_2" className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700">
              ดูรายชื่อทั้งหมดบัญชีที่ 2
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
