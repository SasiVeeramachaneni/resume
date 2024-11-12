// pdfStyles.ts
import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#599AEE',
        paddingBottom: 5,
        paddingTop: 5
    },
    container: {
        marginBottom: 10,
    },
    titleText: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingBottom: 2
    },
    detailsText: {
        fontSize: 8,
        color: '#555',
        paddingBottom: 2
    },
    italicText: {
        fontSize: 8,
        fontStyle: 'italic',
        paddingBottom: 2
    },
});
