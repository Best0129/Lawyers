"use client"
import { useEffect, useState } from 'react';
import supabase from '@/utils/supabaseClient';

export default function Lawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lawyersPerPage] = useState(15); 

    useEffect(() => {
        const fetchLawyers = async () => {
            const { data, error } = await supabase
                .from('lawyers')
                .select(`
                    id,
                    first_name,
                    last_name,
                    phone_number,
                    notes,
                    lawyer_specialization (
                        specialization_id (
                            specialization_name
                        )
                    )
                `)
                .eq('list_number', 1);

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                const formattedData = data.map(lawyer => ({
                    ...lawyer,
                    specialization: lawyer.lawyer_specialization.length > 0 
                        ? lawyer.lawyer_specialization.map(spec => spec.specialization_id.specialization_name).join(', ')
                        : 'ไม่มีความเชี่ยวชาญ'
                }));
                setLawyers(formattedData);
            }
            setLoading(false);
        };

        fetchLawyers();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;

    const indexOfLastLawyer = currentPage * lawyersPerPage;
    const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
    const currentLawyers = lawyers.slice(indexOfFirstLawyer, indexOfLastLawyer);

    const totalPages = Math.ceil(lawyers.length / lawyersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-8 flex flex-col min-h-screen">
            <h1 className="text-2xl font-bold mb-4">รายชื่อทนายความบัญชีที่ 1</h1>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">ลำดับที่</th>
                        <th className="border border-gray-300 p-2">ชื่อ-นามสกุล</th>
                        <th className="border border-gray-300 p-2">หมายเลขโทรศัพท์</th>
                        <th className="border border-gray-300 p-2">ความเชี่ยวชาญทางคดี</th>
                        <th className="border border-gray-300 p-2">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLawyers.map((lawyer, index) => (
                        <tr key={lawyer.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{index + 1 + indexOfFirstLawyer}</td>
                            <td className="border border-gray-300 p-2">{lawyer.first_name} <span className="pl-1">{lawyer.last_name}</span></td>
                            <td className="border border-gray-300 p-2">{lawyer.phone_number || '-'}</td>
                            <td className="border border-gray-300 p-2">{lawyer.specialization}</td>
                            <td className="border border-gray-300 p-2">{lawyer.notes || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="absolute bottom-4 right-4 flex">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}