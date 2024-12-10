import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

export const exportToPDF = async (canvas, projectCode) => {
  // Get canvas dimensions
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Generate filename with date and project code
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).split('/').join('');
  
  const filename = `${dateStr}-${projectCode}.pdf`;

  // Create a new PDF document with canvas dimensions
  const pdf = new jsPDF({
    orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvasWidth, canvasHeight],
    hotfixes: ['px_scaling']
  });

  // Create a temporary SVG from canvas content
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', canvasWidth);
  svg.setAttribute('height', canvasHeight);
  svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  // Add white background
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', canvasWidth);
  bgRect.setAttribute('height', canvasHeight);
  bgRect.setAttribute('fill', '#ffffff');
  svg.appendChild(bgRect);

  // Get current viewport transform and zoom
  const currentVpt = canvas.viewportTransform;
  const zoom = canvas.getZoom();

  // Export each canvas object to SVG elements
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    // Get the absolute coordinates considering viewport transform
    const absolutePos = fabric.util.transformPoint(
      new fabric.Point(obj.left, obj.top),
      canvas.viewportTransform
    );

    if (obj.type === 'image' && obj.name === 'backgroundImage') {
      // Special handling for background image
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', obj.toDataURL());
      
      // Calculate the correct position and scale
      const scaleX = obj.scaleX / zoom;
      const scaleY = obj.scaleY / zoom;
      const left = obj.left - (obj.width * obj.scaleX) / 2;
      const top = obj.top - (obj.height * obj.scaleY) / 2;
      
      const transform = [
        scaleX, 0, 0, scaleY,
        left, top
      ];
      
      image.setAttribute('transform', `matrix(${transform.join(' ')})`);
      image.setAttribute('width', obj.width);
      image.setAttribute('height', obj.height);
      svg.appendChild(image);
    } else if (obj.type === 'i-text' || obj.type === 'text') {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const matrix = obj.calcTransformMatrix();
      
      // Adjust matrix for zoom
      matrix[0] /= zoom;
      matrix[3] /= zoom;
      
      text.setAttribute('transform', `matrix(${matrix.join(' ')})`);
      text.setAttribute('font-family', obj.fontFamily);
      text.setAttribute('font-size', obj.fontSize);
      text.setAttribute('fill', obj.fill);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = obj.text;
      svg.appendChild(text);
    } else if (obj.type === 'path' || obj.type === 'group') {
      const matrix = obj.calcTransformMatrix();
      const svgString = obj.toSVG();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      // Adjust matrix for zoom
      matrix[0] /= zoom;
      matrix[3] /= zoom;
      
      svgElement.setAttribute('transform', `matrix(${matrix.join(' ')})`);
      svg.appendChild(svgElement);
    }
  });

  // Convert SVG to PDF with exact dimensions
  await pdf.svg(svg, {
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight
  });

  // Save the PDF with formatted filename
  pdf.save(filename);
}; 