import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import trainingService from '../services/trainingService'

const COLORS = [
  '#185fa5', '#2e86de', '#48c774', '#ffdd57', '#ff6b6b',
  '#a29bfe', '#fd79a8', '#00cec9', '#e17055', '#6c5ce7'
]

const StatisticsPage = () => {
  const [chartData, setChartData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trainingService
      .getTrainings()
      .then((trainings) => {
        const grouped = _.groupBy(trainings, 'activity')
        const data = Object.entries(grouped)
          .map(([activity, items]) => ({
            activity,
            minutes: _.sumBy(items, 'duration'),
          }))
          .sort((a, b) => b.minutes - a.minutes)
        setChartData(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Harjoitusten lataaminen epäonnistui.')
        setLoading(false)
      })
  }, [])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].payload.activity}</p>
          <p className="tooltip-value">{payload[0].value} min</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tilastot</h1>
      </div>

      {error && (
        <div className="error-banner">
          {error}<button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="card">
        <h2>Harjoitukset aktiviteeteittain (min)</h2>

        {loading ? (
          <div className="empty">Ladataan...</div>
        ) : chartData.length === 0 ? (
          <div className="empty">Ei harjoituksia</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="activity"
                tick={{ fontSize: 13, fill: '#666' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#666' }}
                label={{ value: 'Minuuttia', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 12, fill: '#888' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="stats-grid">
        {chartData.map((item, index) => (
          <div className="stat-card" key={item.activity}>
            <div
              className="stat-color-bar"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            <div className="stat-info">
              <div className="stat-activity">{item.activity}</div>
              <div className="stat-minutes">{item.minutes} min</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatisticsPage