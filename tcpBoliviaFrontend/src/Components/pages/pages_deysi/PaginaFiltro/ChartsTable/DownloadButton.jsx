import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip as MuiTooltip } from '@mui/material';

const DownloadButton = ({ chartRef }) => {
    const handleDownload = () => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const canvas = chart.canvas;

            // Crear un lienzo temporal más grande para incluir la descripción
            const tempCanvas = document.createElement('canvas');
            const tempContext = tempCanvas.getContext('2d');

            const description = document.querySelector('.chart-description')?.textContent || '';
            const padding = 20; // Espacio entre la gráfica y el texto
            const fontSize = 16; // Tamaño de la fuente para el texto

            // Configurar el tamaño del nuevo lienzo
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height + fontSize + padding;

            // Dibujar fondo blanco
            tempContext.fillStyle = 'white';
            tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Dibujar la gráfica en el lienzo temporal
            tempContext.drawImage(canvas, 0, 0);

            // Dibujar la descripción debajo de la gráfica
            tempContext.fillStyle = 'black';
            tempContext.font = `${fontSize}px Arial`;
            tempContext.fillText(
                description,
                10, // Margen izquierdo
                canvas.height + fontSize // Posición debajo de la gráfica
            );

            // Convertir el lienzo temporal a una imagen
            const imageUrl = tempCanvas.toDataURL('image/png');

            // Descargar la imagen
            const link = document.createElement('a');
            link.href = imageUrl;
            console.log(chartRef);
            link.download = 'grafico.png';
            link.click();
        }
    };

    return (
        <MuiTooltip title="Guardar como Imagen" className='btn flex flex-row text-white bg-cyan-600 w-fit size-8 p-1 justify-center rounded-md'>
            <DownloadIcon
            />
            <button onClick={handleDownload}>Descargar Gráfico</button>
        </MuiTooltip>
    )
}

export default DownloadButton