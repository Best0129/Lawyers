"use client";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import {
    Edit,
    Save,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    User,
    Phone,
    ClipboardList,
    Tag,
    CheckCircle,
    FileText,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Lawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lawyersPerPage] = useState(15);
    const [editingLawyerId, setEditingLawyerId] = useState(null);
    const [editedNote, setEditedNote] = useState("");
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("ทั้งหมด");
    const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

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
        `)
                .eq("list_number", 1);

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
                    phone_number: lawyer.phone_number
                        ? formatPhoneNumber(lawyer.phone_number)
                        : "-",
                }));
                formattedData.sort((a, b) => a.id - b.id);
                setLawyers(formattedData);
            }
            setLoading(false);
        };

        fetchLawyers();
    }, []);

    const formatPhoneNumber = (number) => {
        if (typeof number === "string" && number.length === 10) {
            return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
        }
        return number;
    };

    const handleNoteClick = (lawyer) => {
        setEditingLawyerId(lawyer.id);
        setEditedNote(lawyer.notes || "");
    };

    const handleNoteChange = (e) => setEditedNote(e.target.value);

    const handleNoteSave = async (lawyerId) => {
        const { error } = await supabase
            .from("lawyers")
            .update({ notes: editedNote })
            .eq("id", lawyerId);
        if (error) {
            console.error("Error updating note:", error);
            toast.error("เกิดข้อผิดพลาดในการบันทึกหมายเหตุ");
        } else {
            setLawyers((prev) =>
                prev.map((lawyer) =>
                    lawyer.id === lawyerId ? { ...lawyer, notes: editedNote } : lawyer
                )
            );
            toast.success("บันทึกหมายเหตุสำเร็จ");
        }
        setEditingLawyerId(null);
        setEditedNote("");
    };

    const handleNoteKeyDown = (e, lawyerId) => {
        if (e.key === "Enter") handleNoteSave(lawyerId);
        else if (e.key === "Escape") {
            setEditingLawyerId(null);
            setEditedNote("");
        }
    };

    const handleStatusChange = (lawyer, value) => {
        setNewStatus(value);
        setEditingStatusId(lawyer.id);
        if (value !== lawyer.status) handleStatusSave(lawyer.id, value);
        else {
            setEditingStatusId(null);
            setNewStatus("");
        }
    };

    const handleStatusSave = async (lawyerId, status) => {
        const { error } = await supabase
            .from("lawyers")
            .update({ status })
            .eq("id", lawyerId);
        if (error) {
            console.error("Error updating status:", error);
            toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
        } else {
            setLawyers((prev) =>
                prev.map((lawyer) =>
                    lawyer.id === lawyerId ? { ...lawyer, status } : lawyer
                )
            );
            toast.success("เปลี่ยนสถานะสำเร็จ");
        }
        setEditingStatusId(null);
        setNewStatus("");
    };

    const handlePageChange = (page) => setCurrentPage(page);
    const handleSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
        setCurrentPage(1);
    };
    const handleStatusFilterChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    };

    const indexOfLast = currentPage * lawyersPerPage;
    const indexOfFirst = indexOfLast - lawyersPerPage;
    const filteredLawyers = lawyers.filter((lawyer) => {
        const specializationMatch =
            selectedSpecialization === "ทั้งหมด" ||
            lawyer.specialization.includes(selectedSpecialization);
        const statusMatch = selectedStatus === "ทั้งหมด" || lawyer.status === selectedStatus;
        return specializationMatch && statusMatch;
    });
    const currentLawyers = filteredLawyers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);

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

    const getStatusColor = (status) => {
        switch (status) {
            case "ว่าง":
                return "bg-green-500 text-white";
            case "ไม่ว่าง":
                return "bg-red-600 text-white";
            default:
                return "bg-gray-300 text-black";
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );

    const uniqueSpecializations = Array.from(
        new Set(
            lawyers
                .flatMap((lawyer) =>
                    lawyer.specialization
                        .split(", ")
                        .filter((spec) => spec !== "ไม่มีความเชี่ยวชาญ")
                )
        )
    );

    return (
        <div className="p-8 flex flex-col min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-2xl font-bold mb-4 text-center">
                บัญชีรายชื่อทนายขอแรง (บัญชี 1) ศาลจังหวัดปราจีนบุรี
            </h1>
            <h3 className="text-l font-bold mb-1 text-center">ประจำปี 2568 - 2570</h3>

            {/* Filters */}
            <div className="flex justify-end gap-4 mb-4">
                <select
                    value={selectedSpecialization}
                    onChange={handleSpecializationChange}
                    className="border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 hover:shadow-md"
                >
                    <option value="ทั้งหมด">ทุกความเชี่ยวชาญ</option>
                    {uniqueSpecializations.map((spec, idx) => (
                        <option key={idx} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStatus}
                    onChange={handleStatusFilterChange}
                    className="border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 hover:shadow-md"
                >
                    <option value="ทั้งหมด">ทุกสถานะ</option>
                    <option value="ว่าง">ว่าง</option>
                    <option value="ไม่ว่าง">ไม่ว่าง</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed rounded-lg shadow-lg border border-gray-300">
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
                            <th className="w-40 p-2 font-medium">
                                <div className="flex items-center justify-center gap-1">
                                <Phone size={16} /> โทรศัพท์ 
                                </div>
                            </th>
                            <th className="w-64 p-2 font-medium">
                                <div className="flex items-center justify-center gap-1">
                                   <Tag size={16} /> ความเชี่ยวชาญ 
                                </div>
                            </th>
                            <th className="w-24 p-2 font-medium">
                                <div className="flex items-center justify-center gap-1">
                                   <CheckCircle size={16} /> สถานะ 
                                </div>
                            </th>
                            <th className="w-64 p-2 font-medium">
                                <div className="flex items-center justify-center gap-1">
                                   <FileText size={16} /> หมายเหตุ 
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLawyers.map((lawyer, index) => (
                            <tr
                                key={lawyer.id}
                                className="hover:bg-gray-50 cursor-pointer bg-white"
                            >
                                <td className="p-2 text-center">{index + 1 + indexOfFirst}</td>
                                <td className="p-2">{lawyer.first_name} {lawyer.last_name}</td>
                                <td className="p-2 text-center">{lawyer.phone_number}</td>
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
                                <td className="p-2 text-center">
                                    {editingStatusId === lawyer.id ? (
                                        <select
                                            value={newStatus}
                                            onChange={(e) => handleStatusChange(lawyer, e.target.value)}
                                            autoFocus
                                            className="border border-gray-300 p-1 rounded"
                                        >
                                            <option value="ว่าง">ว่าง</option>
                                            <option value="ไม่ว่าง">ไม่ว่าง</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(lawyer.status)}`}
                                            onClick={() => {
                                                setEditingStatusId(lawyer.id);
                                                setNewStatus(lawyer.status);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {lawyer.status} <Edit size={16} />
                                        </span>
                                    )}
                                </td>
                                <td
                                    className="p-2 text-center"
                                    onClick={() => handleNoteClick(lawyer)}
                                >
                                    {editingLawyerId === lawyer.id ? (
                                        <div className="flex items-center gap-1">
                                            <textarea
                                                value={editedNote}
                                                onChange={handleNoteChange}
                                                onBlur={() => handleNoteSave(lawyer.id)}
                                                onKeyDown={(e) => handleNoteKeyDown(e, lawyer.id)}
                                                autoFocus
                                                className="border border-gray-300 p-1 w-full rounded resize-none overflow-hidden"
                                                style={{ height: "auto" }}
                                                onInput={(e) => {
                                                    e.target.style.height = "auto";
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                    handleNoteChange(e);
                                                }}
                                            />
                                            <button onClick={() => handleNoteSave(lawyer.id)}>
                                                <Save size={20} color="blue" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingLawyerId(null);
                                                    setEditedNote("");
                                                }}
                                            >
                                                <X size={20} color="red" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-1">{lawyer.notes || ""}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="absolute bottom-6 right-6 flex gap-2 bg-white rounded-lg shadow-md p-2">
                <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-blue-600 hover:bg-blue-100"
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
