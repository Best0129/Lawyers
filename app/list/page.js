"use client";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { Loader2, Download } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import Table from '../components/table';

// Register the Thai font
Font.register({
    family: 'TH Sarabun New',
    src: '/fonts/THSarabunNew.ttf', // Adjust the path as necessary
});

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        padding: 20,
        fontSize: 12,
        color: "black",
        fontFamily: 'TH Sarabun New',
    },
});

// Mapping of short specialization names to full forms
const specializationMapping = {
    "ยาเสพติด": "คดีความผิดเกี่ยวกับยาเสพติด",
    "ปอ.": "คดีความผิดตามประมวลกฎหมายอาญา",
    "เทคโนฯ": "คดีอาชญากรรมทางเทคโนโลยี",
    "ค้ามนุษย์": "คดีค้ามนุษย์",
    "สิ่งแวดล้อม": "คดีสิ่งแวดล้อม",
    "ทั่วไป": "คดีทั่วไป",
};

const LawyersPDF = ({ lawyers }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Table
                headers={["ลำดับ", "ชื่อ-นามสกุล", "ความเชี่ยวชาญ"]}
                data={lawyers}
            />
        </Page>
    </Document>
);

export default function Lawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpecialization, setSelectedSpecialization] = useState("ทั้งหมด");

    useEffect(() => {
        const fetchLawyers = async () => {
            const { data, error } = await supabase
                .from("lawyers")
                .select(`
          id, first_name, last_name, phone_number, notes, status,
          lawyer_specialization (
            specialization_id (
              specialization_name
            )
          )
        `);

            if (error) {
                console.error("Error fetching data:", error);
            } else {
                const formattedData = data.map((lawyer) => ({
                    ...lawyer,
                    specialization:
                        lawyer.lawyer_specialization.length > 0
                            ? lawyer.lawyer_specialization
                                .map((spec) => spec.specialization_id.specialization_name)
                                .join(", ")
                            : "ไม่มีความเชี่ยวชาญ",
                }));
                formattedData.sort((a, b) => a.id - b.id);
                setLawyers(formattedData);
            }
            setLoading(false);
        };

        fetchLawyers();
    }, []);

    const filteredLawyers = lawyers.filter((lawyer) =>
        selectedSpecialization === "ทั้งหมด" ||
        lawyer.specialization.includes(selectedSpecialization)
    );

    const uniqueSpecializations = Array.from(
        new Set(
            lawyers.flatMap((lawyer) =>
                lawyer.specialization
                    .split(", ")
                    .filter((spec) => spec !== "ไม่มีความเชี่ยวชาญ")
            )
        )
    );

    const getSpecializationColor = (spec) => {
        switch (spec) {
            case "ยาเสพติด":
                return "bg-red-500";
            case "ปอ.":
                return "bg-blue-500";
            case "เทคโนฯ":
                return "bg-orange-500";
            case "ค้ามนุษย์":
                return "bg-yellow-500 text-black";
            case "สิ่งแวดล้อม":
                return "bg-green-500";
            default:
                return "bg-gray-400";
        }
    };

    // Function to map specializations for PDF
    const mapSpecializationsForPDF = (lawyers) => {
        return lawyers.map((lawyer) => ({
            ...lawyer,
            specialization:
                lawyer.lawyer_specialization.length > 0
                    ? lawyer.lawyer_specialization
                        .map((spec) => specializationMapping[spec.specialization_id.specialization_name] || spec.specialization_id.specialization_name)
                        .join(", ")
                    : "ไม่มีความเชี่ยวชาญ",
        }));
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );

    return (
        <div className="p-8 flex flex-col min-h-screen">
            <Toaster position="top-right" />
            <h1 className="text-2xl font-bold mb-4 text-center">
                บัญชีรายชื่อทนายขอแรง
            </h1>
            <div className="flex justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold mb-2">
                    จำนวนทนายทั้งหมด: {filteredLawyers.length} คน
                </h2>
                <PDFDownloadLink document={<LawyersPDF lawyers={mapSpecializationsForPDF(filteredLawyers)} />} fileName="บัญชีรายชื่อทนายขอแรง.pdf">
                    {({ loading }) => (loading ? "กำลังเตรียมเอกสาร..." : <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"><Download size={16} /> ดาวน์โหลด PDF</button>)}
                </PDFDownloadLink>
            </div>

            <div className="overflow-x-auto">
                <table
                    id="lawyers-table"
                    className="min-w-full border border-gray-300 rounded"
                >
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 w-6 text-center">ลำดับ</th>
                            <th className="p-2 w-32 text-center">ชื่อ-นามสกุล</th>
                            <th className="p-2 w-60 text-center">ความเชี่ยวชาญ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLawyers.map((lawyer, index) => (
                            <tr key={lawyer.id} className="bg-white hover:bg-gray-50">
                                <td className="p-2 text-center">{index + 1}</td>
                                <td className="p-2">
                                    {lawyer.first_name} {lawyer.last_name}
                                </td>
                                <td className="p-2 text-center">
                                    {lawyer.specialization !== "ไม่มีความเชี่ยวชาญ" ? (
                                        lawyer.specialization.split(", ").map((spec, idx) => (
                                            <span
                                                key={idx}
                                                className={`inline-block text-xs font-semibold mr-1 mb-1 px-2 py-1 rounded-full text-white ${getSpecializationColor(spec)}`}
                                            >
                                                {spec}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-xs text-center">
                                            ไม่มีความเชี่ยวชาญ
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
