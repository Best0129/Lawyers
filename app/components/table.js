import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    table: {
        display: "table",
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        padding: 8,
        fontSize: 12,
    },
    firstColumn: {
        width: "10%",
        textAlign: "center",
    },
    secondColumn: {
        width: "25%", 
        textAlign: "left",
    },
    lastColumn: {
        width: "65%", 
        textAlign: "left",
    },
    header: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
    },
    title: {
        fontSize: 14,
        textAlign: "center",
        margin: 5,
        fontWeight: "bold",
    },
});

const Table = ({ headers, data }) => {
    const rowsPerPage = 21; // Set the number of rows per page
    const pages = Math.ceil(data.length / rowsPerPage); // Calculate the number of pages

    return (
        <>
            {Array.from({ length: pages }).map((_, pageIndex) => (
                <View key={pageIndex} style={styles.table}>
                    {/* Render Title */}
                    <Text style={styles.title}>
                        บัญชีรายชื่อทนายขอแรง ศาลจังหวัดปราจีนบุรี ประจำปี 2568 - 2570
                    </Text>
                    {/* Render Header */}
                    <View style={styles.tableRow}>
                        {headers.map((header, index) => (
                            <Text key={index} style={[styles.tableCol, styles.header, index === 0 ? styles.firstColumn : index === 1 ? styles.secondColumn : styles.lastColumn]}>
                                {header}
                            </Text>
                        ))}
                    </View>
                    {/* Render Rows for the current page */}
                    {data.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).map((row, rowIndex) => (
                        <View style={styles.tableRow} key={rowIndex}>
                            <Text style={[styles.tableCol, styles.firstColumn]}>{pageIndex * rowsPerPage + rowIndex + 1}</Text>
                            <Text style={[styles.tableCol, styles.secondColumn]}>{row.first_name} {row.last_name}</Text>
                            <Text style={[styles.tableCol, styles.lastColumn]}>{row.specialization}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </>
    );
};

export default Table;
