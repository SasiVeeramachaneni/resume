// pdfStyles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#599AEE",
    paddingBottom: 5,
    paddingTop: 5,
  },
  container: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 10,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  detailsText: {
    fontSize: 8,
    color: "#555",
    paddingBottom: 2,
  },
  italicText: {
    fontSize: 8,
    fontStyle: "italic",
    paddingBottom: 2,
  },
});

export const photoStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e2531",
    paddingBottom: 4,
    paddingTop: 8,
    borderBottom: "1.5px solid #1e2531",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    paddingBottom: 4,
    paddingTop: 8,
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
