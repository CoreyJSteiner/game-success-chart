import { useRef, useEffect } from 'react'
import Chart from 'chart.js/auto'

const ChartDisplay = ({ currentData, yAxisLocked }) => {
  const chartRef = useRef(null)
  const { labels, datasets } = currentData
  const allKeys = labels

  useEffect(() => {
    if (!datasets) return

    const ctx = chartRef.current.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels: allKeys, datasets },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Probability (%)',
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
                weight: 'regular'
              }
            },
            beginAtZero: true,
            max: yAxisLocked ? 1 : undefined,
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              },
              callback: value => `${(value * 100).toFixed(1)}%`
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Number of Successes',
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
                weight: 'bold'
              }
            },
            type: 'linear',
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              },
              stepSize: 1
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                family: 'Arial, sans-serif',
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            bodyColor: '#ffffff',
            titleColor: '#ffffff',
            bodyFont: {
              family: 'Arial, sans-serif',
              size: 12
            },
            titleFont: {
              family: 'Arial, sans-serif',
              size: 14,
              weight: 'bold'
            },
            callbacks: {
              label: context =>
                `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(
                  1
                )}%`
            }
          }
        }
      }
    })

    return () => chart.destroy()
  }, [datasets])

  return (
    <div id='chart-container'>
      <canvas ref={chartRef} />
    </div>
  )
}

export default ChartDisplay
