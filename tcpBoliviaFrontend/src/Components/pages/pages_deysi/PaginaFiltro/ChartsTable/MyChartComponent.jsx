import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const MyChartComponent = ({ chartType, labels, counts, title }) => {
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        const obtenerDatos = async () => {
            let getRandomColor = () => {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };
            try {
                const options = {
                    title: {
                        text: title,
                        left: 'center',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            text: 'text-wrap',
                        },
                    },
                    tooltip: {
                        trigger: chartType === 'pie' ? 'item' : 'axis',
                        formatter: chartType === 'pie' ? '{a} <br/>{b}: {c} ({d}%)' : undefined,
                        axisPointer: chartType !== 'pie' ? { type: 'shadow' } : undefined,
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: { show: true },
                        },
                    },
                    series: [],
                };
                if (chartType === 'pie') {
                    options.series = [
                        {
                            name: title,
                            type: 'pie',
                            radius: '50%',
                            data: labels.map((label, index) => ({
                                name: label,
                                value: counts[index],
                            })),
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: getRandomColor(),
                                },
                            },
                        },
                    ];
                } else {
                    options.xAxis = {
                        type: 'category',
                        data: labels,
                        axisPointer: {
                            type: 'shadow',
                        },
                        axisLabel: {
                            rotate: 90,  // Rota las etiquetas 90 grados
                            interval: 0,  // Para mostrar todas las etiquetas, incluso si están apretadas
                            formatter: function (value) {
                                return value;  // Puedes ajustar el formato si es necesario
                            },
                        },
                    };
                    options.yAxis = {
                        type: 'value',
                        name: 'Cantidad',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}',
                        },
                    };
                    options.series = [
                        {
                            name: title,
                            type: chartType,
                            data: counts,
                            itemStyle: {
                                color: getRandomColor(),
                            },
                        },
                    ];
                }
                options.graphic = {
                    type: 'text',
                    left: 'center',
                    top: '5%',
                    style: {
                        text: `${title}: ${counts.reduce((acc, curr) => acc + curr, 0)}`,
                        fontSize: 11,
                        color: getRandomColor(),
                    },
                };

                setChartOptions(options);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        obtenerDatos();
    }, [chartType, labels, counts, title]);

    const onChartEvent = {
        restore: () => {
            console.log('El gráfico fue restaurado');
        },
    };

    return (
        <div className='w-full max-w-4xl h-[500px] flex justify-self-center shadow-none'>
            <ReactECharts
                option={chartOptions}
                onEvents={onChartEvent}
                style={{ width: '100%', height: '100%' }}
            />
        </div>

    );
};

export default MyChartComponent;
