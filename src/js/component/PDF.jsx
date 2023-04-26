import React, { useRef } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PropTypes from "prop-types";

export const PDF = ({ PDFDocument }) => {
  const pdfRef = useRef();
  console.log(PDFDocument);
  return (
    <div>
      <button onClick={() => pdfRef.current?.update()}>
        Generate PDF
      </button>
      <PDFDownloadLink
        // document={<PDFDocument />}
        fileName="example.pdf"
        ref={pdfRef}
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download now!'
        }
      </PDFDownloadLink>
    </div>
  );
};

PDF.propTypes = {
  PDFDocument: PropTypes.node.isRequired
};